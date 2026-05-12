/* =========================================
   LANGUAGE
========================================= */

const langToggle = document.querySelector('.lang-toggle');

if(langToggle){

  langToggle.addEventListener('click',()=>{

    document.body.classList.toggle('lang-en');

    langToggle.innerText =
      document.body.classList.contains('lang-en')
      ? 'NL'
      : 'EN';

  });

}

/* =========================================
   ACCORDIONS
========================================= */

document.querySelectorAll('.accordion-trigger')
.forEach(btn=>{

  btn.addEventListener('click',()=>{

    const item = btn.parentElement;

    item.classList.toggle('open');

  });

});

/* =========================================
   FEEDBACK FLOAT
========================================= */

const feedbackFloat = document.getElementById('feedback-float');

if(feedbackFloat){

  setTimeout(()=>{
    feedbackFloat.classList.add('visible');
  },14000);

}

const feedbackClose =
document.getElementById('feedback-float-close');

if(feedbackClose){

  feedbackClose.addEventListener('click',()=>{
    feedbackFloat.classList.remove('visible');
  });

}

/* =========================================
   TRACKING INSECTS
========================================= */

const insectPages = {

  kever:"🪲",
  citroenvlinder:"🦋",
  lieveheersbeestje:"🐞"

};

const currentPage =
window.location.pathname
.split("/")
.pop()
.replace(".html","");

if(insectPages[currentPage]){

  let found =
  JSON.parse(localStorage.getItem('wildspoor-found'))
  || [];

  if(!found.includes(currentPage)){

    found.push(currentPage);

    localStorage.setItem(
      'wildspoor-found',
      JSON.stringify(found)
    );

  }

  renderTracker(found);

}

function renderTracker(found){

  const tracker =
  document.getElementById('insect-tracker');

  if(!tracker) return;

  tracker.innerHTML='';

  Object.keys(insectPages)
  .forEach(name=>{

    const foundAlready =
    found.includes(name);

    const card =
    document.createElement('a');

    card.href = `${name}.html`;

    card.className =
      `insect-tracker-card ${
        foundAlready ? 'found' : 'locked'
      }`;

    card.style.background =
      foundAlready
      ? 'linear-gradient(135deg,#566b2f,#7f9b45)'
      : 'linear-gradient(135deg,#444,#666)';

    card.innerHTML = `
      <div class="tracker-insect-img">
        <div style="font-size:4rem">
          ${foundAlready ? insectPages[name] : '⬛'}
        </div>
      </div>

      <div class="tracker-name">
        ${foundAlready ? name : '???'}
      </div>

      <div class="tracker-status">
        ${foundAlready ? 'gevonden' : 'nog niet gevonden'}
      </div>
    `;

    tracker.appendChild(card);

  });

  const progress =
  document.getElementById('found-progress-bar');

  if(progress){

    progress.style.width =
      `${(found.length/3)*100}%`;

  }

  const txt =
  document.getElementById('tracker-progress-text');

  if(txt){

    const remaining = 3-found.length;

    txt.innerText =
      remaining === 0
      ? 'Je hebt alle insecten gevonden!'
      : `Je hebt ${found.length} van de 3 gevonden. Nog ${remaining} te gaan!`;

  }

}

/* =========================================
   COUNTER
========================================= */

const totalEl =
document.getElementById('total-sightings');

const myEl =
document.getElementById('my-sighting-count');

const myElEn =
document.getElementById('my-sighting-count-en');

const input =
document.getElementById('counter-input');

const plus =
document.getElementById('counter-plus');

const minus =
document.getElementById('counter-minus');

const submit =
document.getElementById('counter-submit');

if(totalEl){

  const key =
    `${currentPage}-sightings`;

  const myKey =
    `${currentPage}-my-sightings`;

  let total =
    parseInt(localStorage.getItem(key))
    || parseInt(totalEl.innerText);

  let mine =
    parseInt(localStorage.getItem(myKey))
    || 0;

  update();

  plus.addEventListener('click',()=>{
    input.value =
    parseInt(input.value)+1;
  });

  minus.addEventListener('click',()=>{

    if(parseInt(input.value)>1){

      input.value =
      parseInt(input.value)-1;

    }

  });

  submit.addEventListener('click',()=>{

    const add =
    parseInt(input.value);

    total += add;
    mine += add;

    localStorage.setItem(key,total);
    localStorage.setItem(myKey,mine);

    update();

    submit.innerText='✓';

    setTimeout(()=>{
      submit.innerText='Toevoegen';
    },1500);

  });

  function update(){

    totalEl.innerText = total;

    if(myEl) myEl.innerText = mine;
    if(myElEn) myElEn.innerText = mine;

  }

}

/* =========================================
   IMAGE UPLOAD PREVIEW
========================================= */

const photoInput =
document.getElementById('photo-input');

const uploadPreview =
document.getElementById('upload-preview');

if(photoInput){

  photoInput.addEventListener('change',(e)=>{

    [...e.target.files]
    .forEach(file=>{

      const reader = new FileReader();

      reader.onload = ev => {

        const img =
        document.createElement('img');

        img.src = ev.target.result;

        uploadPreview.appendChild(img);

      };

      reader.readAsDataURL(file);

    });

  });

}