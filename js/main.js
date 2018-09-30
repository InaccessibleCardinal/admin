'use strict';
(function() {
    //utils
    function $id(id) {
        return document.getElementById(id);
    }
    function create(nodeName, child, attrs) {
        let el = document.createElement(nodeName);
        if (child) {
            if (typeof child === 'string') {
                el.innerText = child;
            } else {
                el.appendChild(child);
            } 
        }
        if (attrs) {
            for (let key in attrs) {
                if (key !== 'fn' && key !== 'props') {
                    el.setAttribute(key, attrs[key]);
                } else if (key === 'fn') {
                    el.addEventListener(attrs['fn'].event, attrs['fn'].handler);
                } else if (key === 'props') {
                    let props = attrs.props;
                    let len = props.length;
                    for (let i = 0; i < len; i++) {
                        let prop = props[i];
                        el[prop.type] = prop.value;
                    }
                }
            }
        }
        return el;
    }

    function appendChildren(el, arr) {
        arr.forEach((a) => {
            el.appendChild(a);
        }); 
    }

    function escapeSpecialChars(string){
        return string.replace(/[<>{}()|[\]\\]/g, '');
      }

    function request(url, method, payload) {
        
        return new Promise(function(resolve, reject) {
            
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            (method === 'GET') ? xhr.send() : xhr.send(JSON.stringify(payload));
            xhr.onreadystatechange = function() {
                if (method === 'GET') { 
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {   
                            resolve(xhr.responseXML);
                        } else {
                            reject(xhr.responseText);
                        }   
                    } 
                } else {
                    if (xhr.readyState === 4) {
                        resolve(xhr.responseText)
                    }
                }
            }
            
        });
    }

    //initialize 
    let currentDate = new Date().toLocaleDateString();
    let existingJobs = [];
    let dataUrl = '../admin/data/data.xml';
    let postUrl = '../admin/process.php';

    function renderJobs(jobs) {
        let target = $id('target');
        target.innerHTML = '';
        if (jobs.length > 0) {  
            let h = create(
                'h2', 
                'Existing Jobs', 
                {class: 'existing-jobs-headline'}
            );
            
            target.appendChild(h);
            jobs.forEach((j) => {
                let jDOM = j.buildDom();
                target.appendChild(jDOM);
            });
        } else {
            let noJobsMsg = create(
                'p', 
                'There are currently no jobs posted.',
                {class: 'no-jobs-message'}
            );
            target.appendChild(noJobsMsg);
        }
        
    }

    function editJobs() {
        let je = new JobEditor(existingJobs);
        je.buildDom();
    }
    let editButton = $id('edit');
    editButton.addEventListener('click', editJobs);

//main job class
    function Job(title, date, description, rate) {
        this.title = title;
        this.dateAdded = date;
        this.description = description;
        this.rate = rate;
        this.ids = {
            titleId: null, 
            descriptionId: null, 
            rateId: null
        };
    }
    Job.prototype.setIds = function(titleId, descriptionId, rateId) {
        this.ids.titleId = titleId;
        this.ids.descriptionId = descriptionId;
        this.ids.rateId = rateId;
    }
    Job.prototype.buildDom = function() {
        let d = create(
            'div', 
            false, 
            {class: 'job'}
        );
        let h = create(
            'h3', 
            this.title, 
            {class: 'job-title'}
        ), 
        p1 = create(
            'p', 
            'Description: ' + this.description,
            {class: 'job-paragraph'}
        ), 
        p2 = create(
            'p', 
            'Rate: ' + this.rate,
            {class: 'job-paragraph'}
        );
        appendChildren(d, [h, p1, p2]);
        return d;
    }
    //get jobs
    request(dataUrl, 'GET', false)
        .then(function(xml) {
            let jobs = xml.getElementsByTagName('job');
            let len = jobs.length;
            for (let i = 0; i < len; ++i) {
                let children = jobs[i].children;
                let t = children[0].textContent;
                let dt = children[1].textContent;
                let des = children[2].textContent;
                let r = children[3].textContent;
                existingJobs.push(new Job(t, dt, des, r))
            }
            renderJobs(existingJobs);
        })
        .catch(function(e) {
            console.log('error: ', e);
        });

    //job editor
    function JobEditor(jobs) {
        this.jobs = jobs;
    }

    JobEditor.prototype.scheduleDeleteJob = function(j) {
        let ids = j.ids;
        for (let jId in ids) {
            $id(ids[jId]).disabled = true;
        }
        j.scheduledDelete = true;
        
    }
    JobEditor.prototype.unScheduleDeleteJob = function(j) {
        let ids = j.ids;
        for (let jId in ids) {
            $id(ids[jId]).disabled = false;
        }
        j.scheduledDelete = false;
        
    }

    JobEditor.prototype.buildForm = function() {
        let jobs = this.jobs;
        let wrapper = create('div');
        let _this = this;
        jobs.forEach((j, i) => {
            let div = create(
                'div', 
                false, 
                {class: 'editable-job'}
            ),
            titleLabel = create('label', 'Title: '), 
            titleInp = create(
                'input', 
                false, 
                {
                    id: 'job-title_' + i,
                    type: 'text',
                    value: j.title,
                    fn: {
                            event: 'keyup',
                            handler: function(e) {
                                _this.updateTitle(e, j);
                        }
                    }
                }
            ),
            descLabel = create('label', 'Description: '), 
            descInp = create(
                'textarea', 
                false, 
                {
                    id: 'job-description_' + i,
                    rows: 4,
                    cols: 50,
                    fn: {
                            event: 'keyup',
                            handler: function(e) {
                                _this.updateDescription(e, j)
                            }
                    },
                    props: [
                        {
                            type: 'innerText', 
                            value: j.description
                        }
                    ]
                   
                }
            ),
            rateLabel = create('label', 'Rate: '), 
            rateInp = create(
                'input', 
                false, 
                {
                    id: 'job-rate_' + i,
                    type: 'text',
                    value: j.rate,
                    fn: {
                        event: 'keyup',
                        handler: function(e) {
                                _this.updateRate(e, j)
                            }
                    }
                }
            );
            j.setIds(
                'job-title_' + i,
                'job-description_' + i,
                'job-rate_' + i
            );
            
            let remBtn = create(
                'button', 
                'Delete ' + j.title, 
                {
                    class: 'remove-job',
                    fn: {
                        event: 'click',
                        handler: function() {
                            if (j.scheduledDelete) {
                                _this.unScheduleDeleteJob(j);
                                remBtn.innerText = 'Delete ' + j.title;
                            } else {
                                _this.scheduleDeleteJob(j);
                                remBtn.innerText = 'Deleting. Click to Undo.';
                            }
                        }
                    }
                }
            );

            appendChildren(div, [
                remBtn, 
                titleLabel, 
                titleInp,
                descLabel,
                descInp,
                rateLabel,
                rateInp
            ]);
            wrapper.appendChild(div);
        });
        let subBtn = create(
            'button', 
            'apply changes', 
            {
                class: 'submit-edited-jobs',
                fn: {
                    event: 'click',
                    handler: function() {
                        let updatedJobs = _this.jobs.filter(function(job) {
                            return !job.scheduledDelete;
                        })
                        existingJobs = updatedJobs;
                        renderJobs(existingJobs);
                        _this.destroy();
                        $id('save-button').disabled = false;
                    }
                }
            }
        );
        wrapper.appendChild(subBtn);
        return wrapper;
    }

    JobEditor.prototype.updateTitle = function(e, j) {
        let jobs = this.jobs;
        j.title = escapeSpecialChars(e.target.value);
        let index = jobs.indexOf(j);
        let len = jobs.length;
        let newJobs = jobs.slice(0, index).concat([j], jobs.slice(index + 1, len));
        this.jobs = newJobs;
    }
    JobEditor.prototype.updateDescription = function(e, j) {
        let jobs = this.jobs;
        j.description = escapeSpecialChars(e.target.value);
        let index = jobs.indexOf(j);
        let len = jobs.length;
        let newJobs = jobs.slice(0, index).concat([j], jobs.slice(index + 1, len));
        this.jobs = newJobs;
    }
    JobEditor.prototype.updateRate = function(e, j) {
        let jobs = this.jobs;
        j.rate = escapeSpecialChars(e.target.value);
        let index = jobs.indexOf(j);
        let len = jobs.length;
        let newJobs = jobs.slice(0, index).concat([j], jobs.slice(index + 1, len));
        this.jobs = newJobs;
    }

    JobEditor.prototype.buildDom = function() {
        let _this = this;
        let body = document.body;
        let container = create(
            'div', 
            false, 
            {
                id: 'modal', 
                class: 'modal'
            }
        );
        let close = create(
            'button', 
            'X', 
            {class: 'close-button'}
        );
        close.addEventListener('click', _this.destroy);
        container.appendChild(close);
        container.appendChild(this.buildForm());
        body.appendChild(container);
    }

    JobEditor.prototype.destroy = function() {
        let modal = $id('modal');
        document.body.removeChild(modal);
    }

    //add job form
    function AddJobForm() {
        this.title = {
            value : null, 
            id: 'title-field'
        };
        this.description = {
            value: null, 
            id: 'description-field'
        };
        this.rate = {
            value: null, 
            id: 'rate-field'
        };
    }

    AddJobForm.prototype.buildForm = function() {
        let _this = this;
        let div = create('div', false, false);
        let h = create(
            'h2', 
            'Add a New Job', 
            {class: 'new-jobs-headline'}
        );
        let titleLabel = create('label', 'Title: '),
        descLabel = create('label', 'Description: '),
        rateLabel = create('label', 'Rate: '),
        titleInp = create(
            'input', 
            false, 
            {
                type: 'text', 
                id: this.title.id,
                fn: {
                    event: 'keyup',
                    handler: function(e) {
                        _this.createTitle(e);
                    }
                }
            }
        ),
       
        
        descInp = create(
            'textarea',
             false, 
             { 
                 id: this.description.id,
                 rows: 4,
                 cols: 80,
                 fn: {
                     event: 'keyup',
                     handler: function(e){
                        _this.createDescription(e);
                    }
                 }
            }
        ),
        rateInp = create(
            'input', 
            false, 
            {
                type: 'text', 
                id: this.rate.id,
                fn: {
                    event: 'keyup',
                    handler: function(e) {
                        _this.createRate(e);
                    }
                }
            }
        ),
        addBtnContainer = create(
            'div', 
            false, 
            {class: 'add-button'}
        ),
        addBtn = create(
            'button', 
            'Add To Jobs',
            {
                class: 'add-new-job',
                fn: {
                    event: 'click',
                    handler: function() {
                        _this.addJob();
                    }
                },
                props: [
                    {type: 'id', value: 'add-new-job-button'},
                    {type: 'disabled', value: true}
                ]
            }
        );
        addBtnContainer.appendChild(addBtn);
        
        appendChildren(div, [
            h,
            titleLabel,
            titleInp,
            descLabel,
            descInp,
            rateLabel,
            rateInp,
            addBtnContainer
        ]);
        return div;
    }
    AddJobForm.prototype.createTitle = function(e) {
        this.title.value = escapeSpecialChars(e.target.value);
        $id('add-new-job-button').disabled = false;
    }
    AddJobForm.prototype.createDescription = function(e) {
        this.description.value = escapeSpecialChars(e.target.value);
    }
    AddJobForm.prototype.createRate = function(e) {
        this.rate.value = escapeSpecialChars(e.target.value);
    }
    AddJobForm.prototype.addJob = function() {

        let t = this.title, d = this.description, r = this.rate;
        if (t.value) {
            if (!d.value) {
                d.value = 'N/A';
            }
            if (!r.value) {
                r.value = 'N/A';
            }

            let newJob = new Job(t.value, currentDate, d.value, r.value);
            existingJobs = existingJobs.concat([newJob]);
            renderJobs(existingJobs);
            $id(t.id).value = '';
            $id(d.id).value = '';
            $id(r.id).value = '';
        }
        $id('save-button').disabled = false;
        $id('add-new-job-button').disabled = true;
    }
    AddJobForm.prototype.render = function() {
        let addJobTarget = $id('add-job-form');
        let form = this.buildForm();
        addJobTarget.innerHTML = '';
        addJobTarget.appendChild(form);
    }
    let addJobForm = new AddJobForm();

    addJobForm.render();
    //save button
    function SaveButton() {
        let saveBtnTarget = $id('save-button-container'),
        btn = create(
            'button', 
            'Submit All Changes', 
            {
                class: 'save-button',
                fn: {
                    event: 'click',
                    handler: function() {
                        postJobs(existingJobs);
                    }
                },
                props: [
                    {type: 'id', value: 'save-button'},
                    {type: 'disabled', value: true}
                ]
            }
        );
        saveBtnTarget.innerHTML = '';
        saveBtnTarget.appendChild(btn);

        function postJobs(updatedJobs) {
            let len = updatedJobs.length;
            for (let i = 0; i < len; ++i) {
                delete updatedJobs[i].ids
            }
            request(postUrl, 'POST', updatedJobs)
                .then(function(response) {
                    let json = JSON.parse(response);
                    showSuccessMessage(json.message);
                })
                .catch(function(e) {
                    console.log(e);
                });
        }
    }
    SaveButton();

    function showSuccessMessage(message) {
        let body = document.body,
        msgPara = create(
            'p', 
            message, 
            {class: 'success-message'}
        ),
        msgLink = create(
            'a',
            'View on .com',
            {
                class: 'success-link',
                props: [
                    {type: 'href', value: 'http://www.martinintegrated.com'},
                    {type: 'target', value: '_blank'}
                ]
            }
        ),
        closeAndRefreshBtn = create(
            'button', 
            'OK', 
            {
                class: 'close-button refresh',
                fn: {
                    event: 'click',
                    handler: function() {
                        location.reload();
                    }
                }
            },

        ),
        container = create(
            'div',
            false,
            {class: 'modal success'}
        );
        appendChildren(container, [msgPara, msgLink, closeAndRefreshBtn]);
        body.appendChild(container);
    }

}());