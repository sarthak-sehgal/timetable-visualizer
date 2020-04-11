document.addEventListener("DOMContentLoaded", function () {
    var globalDays = [];
    var globalHours = [];

    const HOURS = [
        "8:00 - 9:00",
        "9:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00"
    ];

    const DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const BACKGROUNDS = [
        "#FFAC00",
        "#ABFF9C",
        "#FF632E",
        "#FF3DA9",
        "#AA49FF",
        "#41FFAC",
        "#0028B2",
        "#FFFFFF",
        "#AAB291",
        "#FFD619",
        '#9B9AFF',
        '#FF7E19',
        '#FFFF19',
        '#B2585C',
        '#0A00B2',
        '#FF199D'
    ];

    let history = [];

    let BG_USED = new Array(BACKGROUNDS.length);
    for(let i=0; i<BG_USED.length; i++)
        BG_USED[i] = 0;
 
    const BG_OPACITY = 60;

    let timetable = document.getElementById("timetable");
    
    for(let i=0; i<12; i++) {
        let div = document.createElement("div");
        div.classList.add("row");
        for(let j=0; j<8; j++) {
            if(i==0) {
                if(j==0) {
                    div.innerHTML += `<span class="cell highlight">Days &rarr;<br>Time &darr;</span>`;
                } else {
                    div.innerHTML += `<span class="cell highlight">${DAYS[j-1]}</span>`;
                }
            } else if (j==0) {
                div.innerHTML += `<span class="cell highlight">${i}: ${HOURS[i-1]}</span>`;
            } else {
                div.innerHTML += `<span class="cell"></span>`;
            }
        }
        timetable.appendChild(div);
    }

    let cells = document.getElementsByClassName("cell");
    let addBtn = document.getElementById("add-btn");

    addBtn.addEventListener("click", addBtnHandler);

    function addBtnHandler () {
        document.getElementById("error").style.display = 'none';
        let title = document.getElementById("course-title").value;
        let classroom = document.getElementById("classroom").value;
        let section = document.getElementById("section").value;
        let days = $("#days").select2('val');

        if (days.length === 0)
            days = globalDays; 
                
        let hours = $("#hours").select2('val');

        if (hours.length === 0)
            hours = globalHours;

        if(title.trim() && days.length>0 && hours.length>0 && section.trim()) {
            let random = Math.floor(Math.random() * (BACKGROUNDS.length));
            while(BG_USED[random]) {
                random = Math.floor(Math.random() * (BACKGROUNDS.length));
            }
            BG_USED[random] = 1;

            let arr = [];
            let flag = 0;

            for(let j=0; j<hours.length; j++) {
                for(let i=0; i<days.length; i++) {
                    let day = Number(days[i]);
                    let hour = Number(hours[j]);
                    
                    if(cells[hour*8 + day].innerHTML !== '') {
                        flag = 1;
                        break;
                    }
                    
                    arr.push(hour*8 + day);
                    cells[hour*8 + day].innerHTML = `<strong>${title}</strong>${section}<br>${classroom}`;
                    cells[hour*8 + day].style.background = BACKGROUNDS[random] + BG_OPACITY.toString();
                }
                if(flag === 1)
                    break;
            }

            if(flag === 1) {
                document.getElementById("error").innerHTML = 'Clash exists! Delete first!';
                document.getElementById("error").style.display = 'flex';
                arr.map(index => {
                    cells[index].innerHTML = '';
                    cells[index].style.background = '';
                });
                BACKGROUNDS[random] = 0;
            } else {
                history.push({
                    bgColorIndex: random,
                    arr
                });
    
                if(!checkLunch()) {
                    undo();
                    document.getElementById("error").innerHTML = 'No lunch break!';
                    document.getElementById("error").style.display = 'flex';
                }
            }


            document.getElementById("course-title").value = '';
            document.getElementById("classroom").value = '';
            document.getElementById("section").value = '';
            $("#days").val('').trigger('change');
            $("#hours").val('').trigger('change');
        } else {
            document.getElementById("error").innerHTML = 'One or more fields missing!';
            document.getElementById("error").style.display = 'flex';
        }
    }


    let undoBtn = document.getElementById("undo-btn");
    undoBtn.addEventListener("click", undo);

    function undo () {
        document.getElementById("error").style.display = 'none';
        if(history.length >= 1) {
            let lastMove = history[history.length - 1].arr;
            for(let i=0; i<lastMove.length; i++) {
                cells[lastMove[i]].innerHTML = '';
                cells[lastMove[i]].style.background = '';
            }
            BG_USED[history[history.length - 1].bgColorIndex] = 0;
            
            history.pop();
        } else {
            document.getElementById("error").innerHTML = 'No history found!';
            document.getElementById("error").style.display = 'flex';
        }
    }

    for(let i=0; i<cells.length; i++) {
        if(i>7 && i%8!==0) {
            cells[i].addEventListener("click", function() {
                document.getElementById("error").style.display = 'none';
                let flag = 0;
                history.map((obj, objIndex) => {
                    obj.arr.map(index => {
                        if(index === i) {
                            flag = 1;
                            BG_USED[obj.bgColorIndex] = 0;
                            obj.arr.map(cellIndex => {
                                cells[cellIndex].innerHTML = '';
                                cells[cellIndex].style.background = '';
                            });
                            history.splice(objIndex, 1);
                            return;
                        }
                    })
                });
                if(!flag) {
                    document.getElementById("error").innerHTML = 'Cell is empty!';
                    document.getElementById("error").style.display = 'flex';
                }
            })
        }
    }

    function checkLunch () {
        document.getElementById("error").style.display = 'none';
        for(let j=1; j<8; j++) {
            let flag = 0;
            for(let i=4; i<=6; i++) {
                if(cells[i*8 + j].innerHTML === '') {
                    flag = 1;
                }
            }
            if(!flag)
                return 0;
        }
        return 1;
    }
    const $messageform = document.getElementById("messageForm");
    const $messageFormInput = $messageform.querySelector("input");
    const $messageFormButton = $messageform.querySelector("button");

    const $choicesForm = document.getElementById("choices");

    $choicesForm.addEventListener("submit", (e) => {
        document.getElementById("error").style.display = 'none';
        e.preventDefault();
        const selection = e.target.elements.slot.value;

        var contents = selection.split(", ")

        document.getElementById("section").value = contents[0] + " " + contents[3];
        document.getElementById("course-title").value = document.getElementById("addAfterSearch").value;
        var days = contents[1].split(" ");
        days.forEach(convert)
        
        function convert(item, index, arr) {
            if (item === "M")
                arr[index] = "1";
            if (item === "T")
                arr[index] = "2";
            if (item === "W")
                arr[index] = "3";
            if (item === "Th")
                arr[index] = "4";
            if (item === "F")
                arr[index] = "5";
            if (item === "S")
                arr[index] = "6";      
        }
        
        if (days[days.length - 1] === "")
            days.pop()
        globalDays = days;
        var hours = contents[2].split("");

        if (hours[hours.length - 1] === "0") {
            hours.pop()
            hours[hours.length - 1] ="10"
        }
        globalHours = hours;
        
        document.getElementById("add-btn").click();
    })

    $messageform.addEventListener("submit", async (e) => {
        
        e.preventDefault();
        $messageFormButton.setAttribute("disabled", "disabled");
        $messageFormButton.innerHTML="Loading..."

        var radio_home = document.getElementById("choices");
        radio_home.innerHTML = "";

        const url=`https://timetablevisualiser-api.herokuapp.com/CourseData?course_number=${e.target.elements.message.value}`
                
        await fetch(url).then((res) => {
            const result = res.json().then((a) => {
                var para = document.createElement("p");
                var node = document.createTextNode(a.Course_Number);
                para.appendChild(node);

                var element = document.getElementById("choices");
                element.appendChild(para);

                if (a.lectures.length === 0) {
                    var para = document.createElement("p");
                    var node = document.createTextNode("Invalid Course Name");
                    para.appendChild(node);

                    var element = document.getElementById("choices");
                    element.appendChild(para);
                }

                else {
                    var para = document.createElement("p");
                    var node = document.createTextNode("Lectures");
                    para.appendChild(node);
                    var element = document.getElementById("choices");

                    var lineBreak = document.createElement("BR");
                    radio_home.appendChild(lineBreak);
                    element.appendChild(para);
                }

                for (var i in a.lectures) {
                    var slot = makeRadioButton("slot", a.lectures[i], a.lectures[i]);
                    var lineBreak = document.createElement("BR");
                    radio_home.appendChild(slot);
                    radio_home.appendChild(lineBreak);
                }

                if (a.practicals.length) {
                    var para = document.createElement("p");
                    var node = document.createTextNode("Practicals");
                    para.appendChild(node);
                    var element = document.getElementById("choices");

                    var lineBreak = document.createElement("BR");
                    radio_home.appendChild(lineBreak);
                    element.appendChild(para);
                }

                for (var i in a.practicals) {
                    var slot = makeRadioButton("slot", a.practicals[i], a.practicals[i]);
                    var lineBreak = document.createElement("BR");
                    radio_home.appendChild(slot);
                    radio_home.appendChild(lineBreak);
                }

                if (a.tutorials.length) {
                    var para = document.createElement("p");
                    var node = document.createTextNode("Tutorials");
                    para.appendChild(node);
                    var element = document.getElementById("choices");

                    var lineBreak = document.createElement("BR");
                    radio_home.appendChild(lineBreak);
                    element.appendChild(para);
                }

                for (var i in a.tutorials) {
                    var slot = makeRadioButton("slot", a.tutorials[i], a.tutorials[i]);
                    var lineBreak = document.createElement("BR");
                    radio_home.appendChild(slot);
                    radio_home.appendChild(lineBreak);
                }
                var newButton = document.createElement("BUTTON");
                var buttonText = document.createTextNode("Add to Timetable");
                newButton.setAttribute("id", "addAfterSearch");
                newButton.setAttribute("value", a.Course_Number);
                newButton.appendChild(buttonText);
                radio_home.appendChild(newButton);
            });
        }).catch((e) => {
            var para = document.createElement("p");
            var node = document.createTextNode("Can't fetch details at the moment.");
            para.appendChild(node);
            var element = document.getElementById("choices");

            var lineBreak = document.createElement("BR");
            radio_home.appendChild(lineBreak);
            element.appendChild(para);
        })

        function makeRadioButton(name, value, text) {
            var label = document.createElement("label");
            var radio = document.createElement("input");
            radio.type = "radio";
            radio.name = name;
            radio.value = value;

            label.appendChild(radio);

            label.appendChild(document.createTextNode(text));
            return label;
        }  
        $messageFormButton.removeAttribute("disabled");
        $messageFormButton.innerHTML = "Search!";
        var scrollingElement = (document.scrollingElement || document.body);
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    });
});

$(document).ready(function() {
    $('#days').select2();
    $('#hours').select2();
});