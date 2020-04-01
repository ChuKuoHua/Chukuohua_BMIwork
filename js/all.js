/** 變數宣告 */
let BMI = 0;
let range = '';
let rangecolor = '';
/** 建立DOM元素 */
const sendBtn = document.querySelector('.send');
const listData = document.querySelector('.list');
const deleteData = document.querySelector('.deleteData');
const btnGroup = document.querySelector('.newBtn');
let HistoryData = JSON.parse(localStorage.getItem('BMI_Data')) || [];

/** 限制身高體重只能輸入數字 */
function Number(e,Number){
    if (!/^\d+[.]?\d*$/.test(Number)){
        var NewStr = /^\d+[.]?\d*/.exec(e.value);
        if(NewStr != null){
            e.value = NewStr;
        }else{
            e.value = '';
        }
    }
    return false;
}
    
/** 資料送出 */
function SubmitData(){
    //取得資料
    let h = document.querySelector('.height').value;
    let w = document.querySelector('.weight').value;
    //檢查格式是否正確
    let Check_h = Number(h);
    let Check_w = Number(w);    
    if(isNaN(Check_h) || isNaN(Check_w)){
        document.querySelector('.error').textContent = '格式不正確請重新輸入!!';        
        return;
    }
    //檢查input值是否有錯誤
    if( h == '' || w == ''){        
        document.querySelector('.error').textContent = '數值不可為空值';
        return;
    }else if(h <= 0 || w <= 0){        
        document.querySelector('.error').textContent = '數值過低，請重新輸入';
        return;
    }else if(h > 300 || w > 250){        
        document.querySelector('.error').textContent = '數值過大，請重新輸入';
        return;
    }

    //隱藏初始按鈕
    sendBtn.style.display="none";

    //打開結果按鈕
    openbtn();

    compute(h,w);
    replaceBtn();
    insertData(h,w);
    updateData(HistoryData);
}

function openbtn(){
    btnGroup.className="newBtn open";
}

/** 計算BMI */
function compute(h,w){
    let BMIstr = w / Math.pow(h / 100, 2);    
    BMI = BMIstr.toFixed(2); //取小數點後2位
    //判斷BMI值標
    if(BMI >=　27){
        range = '肥胖';       
        rangeColor = 'fat';
    } else if(BMI >= 24 && BMI < 27){
        range = '過重';        
        rangeColor = 'heavy';
    } else if(BMI >= 18.5 && BMI < 24){
        range = '理想';
        rangeColor = 'good';
    } else{
        range = '過輕';
        rangeColor = 'light';
    }
}

/** 取得日期 */
function date(){
    let date = new Date();
    let time =date.getFullYear()+ '/' 
    + (date.getMonth() + 1) 
    + '/' + date.getDate() +' '
    + date.getHours() + ':'
    + date.getMinutes() + ':'
    + date.getSeconds();
    return time;
}

/** 建立JSON & 存取localStorage */
function insertData(h,w){
    let totalData = {
        rangeColor:rangeColor,
        height: h,
        weight: w,
        BMI: BMI,
        range:range,
        time: date()
    }
    HistoryData.push(totalData);
    localStorage.setItem('BMI_Data', JSON.stringify(HistoryData));
}

/** 更新歷史資料 */
function updateData(data){
    let str = '';
    let datalen = data.length;
    for (let i = (datalen-1);i >= 0; i--){
        str += `
        <li class="${data[i].rangeColor}">
            <table class="BMI_list">
                <tr>
                    <td>${data[i].range}</td>
                    <td><span>BMI </span>${data[i].BMI}</td>
                    <td><span>Weight </span>${data[i].weight}<span> kg</span></td>
                    <td><span>Height </span>${data[i].height}<span> cm</span></td>
                    <td><span>${data[i].time}</span></td>
                    <td><img src="../Chukuohua_BMIwork/imgs/del.svg" data-index=${i}></a></td>
                </tr>
            </table>
        </li>`;
    }
    listData.innerHTML = str;    
}

/** 改變按鈕顏色 */
function replaceBtn(){
    let str = 
    `
    <div class="btnBox">
        <p class="BMI_range">${range}</p>
        <hr class="hrColor">
        <p class="BMI_title"> BMI </p>
        <p class="BMI_value">${BMI}</p>
        <a href="#" id = "replyBtn">
            <img class="icon" src="../Chukuohua_BMIwork/imgs/icons_loop.png">
        </a>
    </div>
    `
    btnGroup.innerHTML = str;

    const btnContent = document.querySelector('.btnBox')
    const replyBtn = document.getElementById('replyBtn');

    //對應範圍改變按鈕顏色
    switch(range){
        case '肥胖':
            btnGroup.setAttribute('style','border: 5px solid #FF6C03');
            btnContent.setAttribute('style','color:#FF6C03');
            replyBtn.setAttribute('style', 'background-color: #FF6C03');
            break;
        case '過重':
            btnGroup.setAttribute('style','border: 5px solid #FF982D');
            btnContent.setAttribute('style','color:#FF982D');
            replyBtn.setAttribute('style', 'background-color: #FF982D');
            break;
        case '理想':
            btnGroup.setAttribute('style','border: 5px solid #86D73F');
            btnContent.setAttribute('style','color:#86D73F');
            replyBtn.setAttribute('style', 'background-color: #86D73F');
            break;
        case '過輕':
            btnGroup.setAttribute('style','border: 5px solid #31BAF9');
            btnContent.setAttribute('style','color:#31BAF9');
            replyBtn.setAttribute('style', 'background-color: #31BAF9');
            break;
    }
    replyBtn.addEventListener('click',replybtn,false)
}

/** 恢復按鈕功能 */
function replybtn(e){
    e.preventDefault();
    btnGroup.className="newBtn";
    sendBtn.style.display="block";
    //清空input資料
    document.getElementById("height").value="";
    document.getElementById("weight").value="";
}

/** 清除單筆資料 */
function del_Single(e){
    e.preventDefault();
    //console.log(e.target.nodeName);
    if(e.target.nodeName !=='IMG'){return};
    let indexStr = e.target.dataset.index;
    HistoryData.splice(indexStr,1);
    updateData(HistoryData);
}

/** 清除歷史資料 */
function deleteList(){
    localStorage.removeItem('BMI_Data');
    HistoryData = [];
    updateData(HistoryData);
}

/** border-bottom動畫 */
const deleteAmi = document.getElementById('deleteAmi');

deleteAmi.addEventListener('mousemove',function(){
    document.querySelector('.bor_bot').style.width = 80 +'px' ;
})

/** 監聽事件 */
sendBtn.addEventListener('click',SubmitData,false);
deleteData.addEventListener('click',deleteList,false);
listData.addEventListener('click',del_Single,false);

/** 執行程式 */
function Start(){
    updateData(HistoryData);
}

Start();