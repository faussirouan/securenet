const bouton = document.querySelector('#bonj');
bouton.addEventListener('click', (event)=>{
    event.preventDefault();
    alert('Vous etes déjà à l\'accueil !');
})
 (function() {
      // ajuste le padding-top si la nav est plus haute que prévue (fallback)
      const nav = document.querySelector('.fixed-nav');
      if (nav) {
        const height = nav.offsetHeight;
        const spacer = document.querySelector('div[style*="height: 85px;"]');
        if (spacer && height > 60) {
          spacer.style.height = height + 15 + 'px';
        }
      }
    })();