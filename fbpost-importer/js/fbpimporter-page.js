var defaultImageUrl = '//placehold.it/350x150'
    , defaultImageCaption = ''
    , defaultTitle = 'View Details'
    ;

/**
 * Render the markuop for posts
 * @param {JSON data} all post data
 * @returns {undefined}
 */
function renderPosts(data) {
    //console.debug(data);

    var errorMessage = ''
        , postsContainer = document.getElementsByClassName('fbpimporter-plugin-container')[0]
        ;

    if (data.error) {
        if (data.error.code === 190 && data.error.subcode === 463) {
            errorMessage = 'Token has expired. Please login to facebook';
        } else {
            errorMessage = 'Problem loading plugin. Please try again later.';
        }
    }

    if (!errorMessage && Object.prototype.toString(data) !== '[object Object]') {
        try {
            data = JSON.parse(data)
        } catch (e) {
            // parse error
            errorMessage = 'Problem loading plugin. Please try again later.';
        }
    }

    if (errorMessage) {
        postsContainer.appendChild(document.createTextNode(errorMessage));
        return ;
    }

    data.forEach(function(datum) {
        postsContainer.appendChild(generatePostMarkup(datum));
    });
}

/**
 * Generate markup for each post item
 * @param {JSON data} Individual post data
 * @returns {HTMLElement} post markup
 */
function generatePostMarkup(data) {
    var postWrapper = document.createElement('div');
    postWrapper.className = 'fbpimporter-post-wrapper';

    postWrapper.appendChild(getPostImageMarkup(data));
    postWrapper.appendChild(getPostSocialMarkup(data));
    postWrapper.appendChild(getPostTitleMarkup(data));

    return postWrapper;
}

/**
 * Generate markup for each post image
 * @param {JSON data} Individual post data
 * @returns {HTMLElement} post image markup
 */
function getPostImageMarkup(data) {

    var postImageWrapper = document.createElement('div');
    postImageWrapper.className = 'fbpimporter-post-image-wrapper';

    var postImage = document.createElement('img');
    postImage.className = 'fbpimporter-post-image';
    postImage.src = data.image || defaultImageUrl;
    postImage.alt = data.title || 'defaultImageCaption';

    postImageWrapper.appendChild(postImage);

    return postImageWrapper;
}

/**
 * Generate markup for each post title
 * @param {JSON data} Individual post data
 * @returns {HTMLElement} post title markup
 */
function getPostTitleMarkup(data) {
    var postTitleWrapper = document.createElement('div');
    postTitleWrapper.className = 'fbpimporter-post-title-wrapper';

    var postTitle = document.createTextNode(data.title || data.description || defaultTitle);

    if (data.slug) {
        var postLink = document.createElement('a');
        postLink.className = 'fbpimporter-post-link';
        postLink.setAttribute('href', data.slug);
        postLink.appendChild(postTitle);
        postTitleWrapper.appendChild(postLink);
    } else {
        postTitleWrapper.appendChild(postTitle);
    }

    return postTitleWrapper;
}

/**
 * Generate markup for each post social option
 * @param {JSON data} Individual post data
 * @returns {HTMLElement} post social markup
 */
function getPostSocialMarkup(data) {
    var postSocialWrapper = document.createElement('div');
    postSocialWrapper.className = 'fbpimporter-post-social-wrapper';

    postSocialWrapper.appendChild(getSocialLikeMarkup(data.slug));
    postSocialWrapper.appendChild(getSocialShareMarkup(data.slug));

    return postSocialWrapper;
}

/**
 * Generate markup for each post social like option
 * @param {String slug} Individual post data
 * @returns {HTMLElement} post social like markup
 */
function getSocialLikeMarkup(slug) {
    var postSocialLike = document.createElement('div');
    postSocialLike.className = 'fb-like fbpimporter-social-like';
    postSocialLike.setAttribute('data-href', slug);
    postSocialLike.setAttribute('data-layout', 'button');
    postSocialLike.setAttribute('data-action', 'like');
    postSocialLike.setAttribute('data-show-faces', 'true');
    postSocialLike.setAttribute('data-share', 'false');

    return postSocialLike;
}

/**
 * Generate markup for each post social share option
 * @param {String slug} Individual post data
 * @returns {HTMLElement} post social share markup
 */
function getSocialShareMarkup(slug) {
    var postSocialShare = document.createElement('div');
    postSocialShare.className = 'fb-share-button fbpimporter-social-share';
    postSocialShare.setAttribute('data-href', slug);
    postSocialShare.setAttribute('data-layout', 'button');

    return postSocialShare;
}