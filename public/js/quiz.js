var tempanswer = "";
var mp = new Map();
var arr = new Array();

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('Useranswer')
    window.location.href = '/'
}

function fetchUser() {
    fetch(`/user/access`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'auth_token': `${localStorage.getItem('token')}`
        }
    })
        .then((res) => res.json())
        .then((body) => {
            // console.log(body);
            if (body.status === 0) {
                if (body.data.stream.length === 0) {
                    window.location.href = '/data'
                }
                // console.log(body.data)
                var html = `
                        <h1>${body.data.name}</h1>
                    <div class="otherdetail">
                        <h4>Application No : ${body.data.applicationNo},</h4>
                        <h4>Stream : ${body.data.stream},</h4>
                        <h4>Program : ${body.data.program}</h4>
                    </div>  
                `;
                arr = body.data.answer;
                // console.log(arr);
                document.getElementById('Detail').innerHTML = html
                getquiz(body.data.stream);
            } else {
                localStorage.removeItem('token')
                window.location.href = '/'
            }
        })
        .catch((error) => {
            localStorage.removeItem('token')
            window.location.href = '/'
        });
}

if (localStorage.getItem('token')) {
    fetchUser();
} else {
    window.location.href = '/'
}

const getquiz = (stream) => {

    var now = new Date();
    if (now < startDate && window.location.pathname !== '/instruction') {
        // console.log('noew');
        window.location.href = '/instruction'
    }

    fetch(`/question/sendquestion`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            'stream': `${stream}`
        })
    })
        .then((res) => res.json())
        .then((res) => {
            // console.log(res);
            if (res.status === 0) {
                displayquestion(res.data);
            }
        })
        .catch()
}

const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

const displayquestion = (data) => {
    // console.log(data);
    var html = ``;
    var htQuestion = ``;
    for (var i = 0; i < data.length; i++) {
        var idxnew = (Number)(i) + 1;
        htQuestion += `<div class="short" onclick="previous(${i},${data.length})" id="optionchoose_${data[i].id}">${i + 1}</div>`
        html += `
        <div class="mcq" id="${i}">
                <h1><span>${idxnew}.</span> ${data[i].question}</h1>
                <ul>`

        if (data[i].image.contentType) {
            // console.log('image');
            var img = arrayBufferToBase64(data[i]['image'].data.data);
            var imgSrc = `data:image/${data[i].image.contentType};base64,${img.toString('base64')}`;
            html += `<img src='${imgSrc}' alt='server error'/>`
        }
        html += `<h3>Choose option below</h3>`;
        for (j in data[i].choice) {
            // console.log(i);
            var idxoption = (Number)(j) + 1;
            html += `<li id="${data[i].id}_option${j}" onclick="setAnswer('${data[i].id}','${j}','${data[i].choice[j]}')"><span> ${idxoption}. </span> ${data[i].choice[j]}</li>`
        }
        html += `</ul>
                <div class="answer"></div>
                <div class="differentquestion">`

        if (i > 0) {
            var idx = (Number)(i) - 1;
            html += `<button type="submit" onclick="previous(${idx},${data.length})"> Previous </button>`
        } else {
            html += `<button type="submit" disabled> Previous </button>`
        }

        if (Number(i) < data.length - 1) {
            var idx = (Number)(i) + 1;
            html += `<button type="submit" onclick="next(${idx},${data.length})" > Next </button>`
        } else {
            html += `<button type="submit" disabled> Next </button>`
        }

        html += `</div>`
        if (Number(i) === data.length - 1) {
            // console.log(i);
            html += `<div class="submitbutton" id="submitbuttonID">
                    <button type="submit" onclick="submitAnswercreate()"> Submit </button>
                </div>`
        }
        html += `</div>`
    }
    document.getElementById('quizdisplay').innerHTML = html;
    document.getElementById('questionshow').innerHTML = htQuestion;

    // if (localStorage.getItem('Useranswer')) {
    //     // console.log(`here`);
    //     var value = localStorage.getItem('Useranswer');
    //     value = JSON.parse(value);
    //     // console.log(value)
    //     // mp = value;
    //     for (const key in value) {
    //         // console.log(key)
    //         // console.log(value[key])
    //         setAnswer(key, value[key].i, value[key].answer)
    //     }
    // }
    // console.log(arr);
    for (var i in arr) {
        // console.log(i);
        setAnswer(arr[i].key, arr[i].option, arr[i].value)
    }

    previous(0, data.length);
}

function previous(i, sz) {
    tempanswer = "";
    for (let index = 0; index < sz; index++) {
        var value = document.getElementById(`${index}`);
        value.style.display = 'none'
    }
    var value = document.getElementById(`${i}`);
    value.style.display = 'block'
}

function next(i, sz) {
    tempanswer = "";
    for (let index = 0; index < sz; index++) {
        var value = document.getElementById(`${index}`);
        value.style.display = 'none'
    }
    var value = document.getElementById(`${i}`);
    value.style.display = 'block'
}


// answer updation


function setAnswer(id, i, answer) {
    tempanswer = answer;
    // console.log(i)
    // console.log(answer)
    if (answer === undefined) {
        return;
    }
    // if (localStorage.getItem('Useranswer')) {
    //     // console.log(`here`);
    //     var value = localStorage.getItem('Useranswer');
    //     value = JSON.parse(value);
    //     // console.log(value)
    //     mp = value;
    // }
    mp[id] = {
        answer: answer,
        i: i
    }
    // var store = JSON.stringify(mp);
    // localStorage.setItem('Useranswer', store);
    for (let index = 0; index < 4; index++) {
        var value = document.getElementById(`${id}_option${index}`);
        value.style.background = 'white';
    }
    var value = document.getElementById(`${id}_option${i}`);
    value.style.background = 'rgb(64, 145, 215)';
    middleAnswer();
    // console.log(mp);
}

const middleAnswer = () => {
    // console.log(mp);
    const arr = new Array();
    for (const key in mp) {
        // console.log(key)
        arr.push({
            key: key,
            option: mp[key].i,
            value: mp[key].answer
        })
        // console.log(value[key])
    }
    // console.log(arr);
    fetch('/user/uploadAnswermiddle', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'auth_token': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            answer: arr
        })
    })
        .then((res) => res.json())
        .then((res) => {
            // console.log(res);
            for(const i in arr){
                // console.log(arr[i]);
                document.getElementById(`optionchoose_${arr[i].key}`).style.background=`green`;
            }
        })
        .catch()
}


const submitAnswercreate = () => {
    let data = document.getElementById('submitbuttonID');
    var newhtml = `
        You want to submit. Are you sure?
        <select name="program" id="submitprogram" required>
            <option value="NO">NO</option>
            <option value="YES">YES</option>
        </select>
        <div>
            <button type="submit" onclick="submitAnswer()"> Submit </button>
        </div>
    `
    data.innerHTML = newhtml;
}

const submitAnswer = () => {
    value = document.getElementById('submitprogram').value;
    // console.log(value);
    if (value === 'NO') {
        return;
    }
    // return
    // console.log(mp);
    const arr = new Array();
    for (const key in mp) {
        // console.log(key)
        arr.push({
            key: key,
            option: mp[key].i,
            value: mp[key].answer
        })
        // console.log(value[key])
    }
    console.log(arr);
    fetch('/user/uploadAnswer', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'auth_token': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            answer: arr
        })
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            if (res.status === 0) {
                alert('Successfully submitted')
                logout();
            }
        })
        .catch(() => {

        })
}


const submitAnswer2 = () => {
    // var val = confirm('You want to submit. Are you sure?')
    // console.log(val);
    // if(val===false){
    //     return 
    // }
    // return
    // console.log(mp);
    const arr = new Array();
    for (const key in mp) {
        // console.log(key)
        arr.push({
            key: key,
            option: mp[key].i,
            value: mp[key].answer
        })
        // console.log(value[key])
    }
    console.log(arr);
    fetch('/user/uploadAnswer', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'auth_token': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            answer: arr
        })
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            if (res.status === 0) {
                alert('Successfully submitted')
                logout();
            }
        })
        .catch(() => {

        })
}