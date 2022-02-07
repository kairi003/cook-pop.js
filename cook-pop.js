javascript: {
  const exHtml = `<style id="ex-style">
.ps_tab_ab {
  display:none;
}
.card {
  background: white;
}
.recipe_card_flex_wrapper,
.card_image {
  height: 100%;
}
.card_image>img {
  object-fit: cover;
  height: 100%;
}
.ingredients {
  -webkit-line-clamp: 4;
}
</style>

<template id="exTemplate">
  <a class="recipe-content-template recipe_link flex_recipe_content track_hakari2" id="recipe" href="/recipe/">
    <div class="card_content">
      <h2 class="recipe_title"></h2>
      <div class="author"> by {loading...}</div>
      <div class="ingredients">{loading...}</div>
    </div>
  </a>

  <div class="recipe-favorite-template myfolder_button_container" >
    <a class="not_logged_add_recipe_button" href="/myfolder/add_recipe?recipe_id=">
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 48 48" class="ic_myfolder_add"><path d="M40 14H28v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h23.5v-3.5h-2a4.5 4.5 0 0 1 0-9h2v-2a4.5 4.5 0 0 1 9 0v2H44V18a4 4 0 0 0-4-4zm2.5 20.5h-5v-5a1.5 1.5 0 0 0-3 0v5h-5a1.5 1.5 0 0 0 0 3h5v5a1.5 1.5 0 0 0 3 0v-5h5a1.5 1.5 0 0 0 0-3z"></path></svg>
    </a>
  </div>
</template>
`;
  document.head.insertAdjacentHTML('beforeend', exHtml);

  const loadContent = async flexContent => {
    console.log(flexContent);
    const recipeTitle = flexContent.querySelector('.recipe_title').textContent;
    fetch(flexContent.href)
      .then(r => r.text())
      .then(t => new DOMParser().parseFromString(t, 'text/html'))
      .then(d => {
        const ogTitle = d.head.querySelector('meta[property="og:title"]').content;
        const eTitle = recipeTitle.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        const authorName = ogTitle.replace(new RegExp(eTitle), '');
        const author = flexContent.querySelector('.author');
        author.textContent = authorName;
        const desc = d.head.querySelector('meta[property="og:description"]').content;
        const ingredients = flexContent.querySelector('.ingredients');
        ingredients.textContent = desc;
      });
  }

  const observer = new IntersectionObserver((e, ob) => e.forEach(e => {
    if (e.intersectionRatio > 0) {
      ob.unobserve(e.target);
      loadContent(e.target);
    }
  }));

  document.querySelectorAll('#recipes>li.recipe').forEach(li => {
    li.className = 'card recipe';

    const flexWrapper = li.firstElementChild;
    flexWrapper.className = 'recipe_card_flex_wrapper';

    const flexImage = flexWrapper.firstElementChild;
    flexImage.classList.add('flex_recipe_image');
    const recipeTitle = flexImage.querySelector('.card_image img').alt;
    const recipeId = flexImage.id.match(/\d+/)[0];
    flexImage.id += '_im';
    flexImage.href = '/recipe/' + recipeId;

    const template = document.querySelector('#exTemplate');

    const flexContent = template.content.querySelector('.recipe-content-template').cloneNode(true);
    flexContent.id += recipeId;
    flexContent.href += recipeId;
    flexContent.querySelector('.recipe_title').textContent = recipeTitle;
    flexWrapper.appendChild(flexContent);

    const rect = flexContent.getBoundingClientRect();
    if (rect.bottom < 0 || window.innerHeight < rect.top) {
      observer.observe(flexContent);
    } else {
      console.log('before');
      loadContent(flexContent);
    }

    const favorite = template.content.querySelector('.recipe-favorite-template').cloneNode(true);
    favorite.firstElementChild.href += recipeId;
    li.appendChild(favorite);
  });

}