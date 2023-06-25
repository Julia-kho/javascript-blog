'use strict';

//Allowing links on the left to switch articles

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!'),
  console.log(event);


  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

//Creation of list of titles in the left column

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optArticleAuthorSelector = '.post-author .list';


function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html += linkHTML;

    // Get the author's name from the data-author attribute
    const articleAuthor = article.getAttribute('data-author');
    // Display the author's name after the words "by"
    const authorHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    article.querySelector('.post-author').innerHTML = 'by ' + authorHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

//Tags

function calculateTagsParams(tags){
  const params = {max: 0, min: 999999};

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if(tags[tag] > params.max){
      params.max = tags[tag];
    }

    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }

  return params;
}

function calculateTagClass (count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return optCloudClassPrefix + classNumber;
}


function generateTags(){

  const optTagsListSelector = '.tags.list';
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find tags wrapper */

    const titleTag = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){
      console.log(tag);
      /* generate HTML of the link */

      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      console.log(linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;
      console.log(html);

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){

        /* [NEW] add tag to allTags objects */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    titleTag.innerHTML = html;
    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  let allTagsHTML = '';

  /*[NEW] STARY LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /*[NEW] generate code of a link and add it to allTagsHTML */

    const tagLinkHTML = '<li><a class="'+ calculateTagClass(allTags[tag], tagsParams) +'" href="#tag-' + tag + '">' + tag + '</a></li>';
    console.log('tagLinkHTML:', tagLinkHTML);
    allTagsHTML += tagLinkHTML;
  }
  /*[NEW] END LOOP: for each tag in allTags */

  /*[NEW] add HTML for allTagsHTML to tagList: */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

//Clicking tags

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks){

    /* remove class active */
    activeTagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const TagLinks = document.querySelectorAll(href);
  console.log(TagLinks);

  /* START LOOP: for each found tag link */
  for(let TagLink of TagLinks){
    /* add class active */
    TagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {

    /* add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

//Authors

function calculateAuthorsParams(articleAuthors){
  const params = {max: 0, min: 999999};

  for(let articleAuthor in articleAuthors){
    console.log(articleAuthor + ' is used ' + articleAuthors[articleAuthor] + ' times');

    if(articleAuthors[articleAuthor] > params.max){
      params.max = articleAuthors[articleAuthor];
    }

    if(articleAuthors[articleAuthor] < params.min){
      params.min = articleAuthors[articleAuthor];
    }
  }

  return params;
}

function calculateAuthorClass (count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return optCloudClassPrefix + classNumber;
}


function generateAuthors() {
  // Find the list of authors in the right column
  const authorList = document.querySelector('.list.authors');

  // Create a new variable allAuthors with an empty object
  let allAuthors = {};

  // Find all articles
  const articles = document.querySelectorAll(optArticleSelector);

  // Loop through each article
  for (let article of articles) {
    // Get the author from the data-author attribute
    const articleAuthor = article.getAttribute('data-author');

    // Check if this author is not already in allAuthors
    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      // Add author to allAuthors object
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  // Create a variable for all links HTML code
  const authorsParams = calculateAuthorsParams(allAuthors);
  let allAuthorsHTML = '';

  // Loop through each author in allAuthors
  for (let articleAuthor in allAuthors) {
    // Generate code of a link and add it to allAuthorsHTML
    const authorLinkHTML = `<li><a class="${calculateAuthorClass(allAuthors[articleAuthor], authorsParams)}" href="#author-${articleAuthor}">${articleAuthor}</a></li>`;
    allAuthorsHTML += authorLinkHTML;
  }

  // Add HTML for allAuthorsHTML to authorList
  authorList.innerHTML = allAuthorsHTML;
}
generateAuthors();

//Clicking Authors

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  console.log(author);

  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks){

    /* remove class active */
    activeAuthorLink.classList.remove('active');

  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(authorLinks);

  /* START LOOP: for each found author link */
  for(let authorLink of authorLinks){
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found author link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {

    /* add authorClickHandler as event listener for that link */

    authorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();

// Cloud of Tags


