window.$ = (el) => document.querySelector(el);

let timeNow = new Date().toLocaleTimeString()

let token = `AAG_4SiBRY_HbutH0gdVOc9oHLEPZs1B6C0` //получаем при создании бота

let chatId = `1747242939` //получаем при вызове https://api.telegram.org/bot{token}/getupdates в браузере

let botId = `6134750301` 


let lastMesText,lastMesTime,nowMesTime,chatUpdater

let tpl = `
<div class="chat__wrap">
<div class="chat__title">Online-Chat
<div class="btm__close chat__close">&times;</div>
</div>
<div class="chat__body">
<div class="chat__body__item chat__body__item__manager">
<span class="chat__body__item__user">Manager</span>
<span class="chat__body__item__text">Здравствуйте какой у вас вопрос?</span>
<i class="chat__body__item__time">${timeNow}</i>
</div>
</div>
<div class="chat__input">
    <div class="chat__input__message">
        <textarea type="text" class="chat__main__input" aria-label="Напишите сообщение" placeholder="Write a message..." required></textarea>
    </div>
    <button class="chat__input__submit" aria-label="Отправить сообщение" style="background-image:url('telegram-chat/angle-right.svg')"></button>
</div>

</div>`;



class TelegaChat {

init(){ 

    
    $('body').insertAdjacentHTML( 'afterbegin', tpl)

    let store = localStorage.getItem("historyMessages");

    if (store !== null) {
      $('.chat__body').innerHTML = store
    }

    $('.chat__main__input').addEventListener('keypress', (e)=>{

      if(e.key === `Enter`) this.submit();

    })

    $(".chat__input__submit").onclick = () => this.submit();

    

  }



  open() {

        $(".chat__close").addEventListener("click", (e) =>this.close());

        $(".chat__body").scrollTop = 100000;

        $('.chat__wrap').classList.add('open')

        axios.get(`https://api.telegram.org/bot${botId}:${token}/getupdates`)

        .then(r=>{

          lastMesTime = r.data.result[r.data.result.length - 1].message.date

        })

        if(typeof ym === 'function') ym(49104928,'reachGoal','chat-open')

        chatUpdater =  setInterval(() => this.checkResponse(),1000)

  }

  close() {
    $('.chat__wrap').classList.remove('open')
    // clearInterval(chatUpdater);
  }

  submit() {

    //отправка сообшения клиентом

    let val = $(".chat__main__input").value;

    if(val !== ``) {


    let tplItemClient = `<div class="chat__body__item chat__body__item__client">
    <img class="chat__body__item__user__icon cards__theme" src="img/man9.svg" alt="аватарка user">
    <span class="chat__body__item__user">You</span>
    <span class="chat__body__item__text">${val}</span>
    <i class="chat__body__item__time">${timeNow}</i></div>`;


    $('.chat__body').innerHTML += tplItemClient;

    $(".chat__main__input").value = ``.trim()

    $(".chat__body").scrollTop = 100000;

    axios.get(`https://api.telegram.org/bot${botId}:${token}/sendMessage?chat_id=${chatId}&text=${val}`)

    // soundPush('/sound/set.mp3'); //эта функция вызова звука (звук уведомления об отправке и получение сообшения) есть у меня в репе --- https://github.com/themaltsev/open-plugins/blob/master/add-sound.js

  }
  else {
    alert(`Введите текст`)
  }
}

  checkResponse() {

      axios.get(`https://api.telegram.org/bot${botId}:${token}/getupdates`)
        .then((r) => {

          nowMesTime = r.data.result[r.data.result.length - 1].message.date

          if(nowMesTime !== lastMesTime) {
            
          //клиент получает сообщение

          lastMesTime = nowMesTime

          let Text = r.data.result.pop().message.text

            let tplItemMenager = `<div class="chat__body__item chat__body__item__manager">
            <span class="chat__body__item__user">Менеджер</span>
            <span class="chat__body__item__text">${Text}</span>
            <i class="chat__body__item__time">${timeNow}</i></div>`;
            
            $(".chat__body").innerHTML += tplItemMenager;
  
           if(localStorage) localStorage.setItem("historyMessages", $(".chat__body").innerHTML);
  
            $('.chat__wrap').classList.contains('open')? ``: alert(`Сообщение: ${Text}`)

            $(".chat__body").scrollTop = 100000;

            // soundPush('/sound/get.mp3'); // эта функция вызова звука (звук уведомления об отправке и получение сообшения) есть у меня в репе --- https://github.com/themaltsev/open-plugins/blob/master/add-sound.js

        }
        });


  }
}


new TelegaChat().init()