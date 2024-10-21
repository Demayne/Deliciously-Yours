$(function () { // jQuery's shorthand for $(document).ready()
    let currentReviewIndex = 0; // Tracks the current review index
    let savedItems = [];

    let reviews = [
        "The food here is amazing! I tried the lobster thermidor, and it was the best I've ever had!",
        "The atmosphere is so cozy, and the staff is wonderful. I love the seasonal dishes they offer!",
        "Their dessert menu is to die for. The lava cake was heavenly!"
    ]; // Default reviews

    // Load saved items and reviews from localStorage, with error handling
    try {
        savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        const storedReviews = JSON.parse(localStorage.getItem('reviews'));
        reviews = storedReviews || reviews;
        if (!storedReviews) {
            localStorage.setItem('reviews', JSON.stringify(reviews)); // Set default reviews
        }
    } catch (error) {
        console.error("Error parsing localStorage data", error);
    }

    // Dropdown functionality
    const $menuButton = $('.dropbtn');
    const $dropdownContent = $('.dropdown-content');
    
    // Hide dropdown content initially and toggle with slide effect
    $dropdownContent.hide();
    $menuButton.on('click', function (e) {
        e.stopPropagation();
        $dropdownContent.slideToggle(); // Use slideToggle for smooth open/close
    });

    // Close dropdown if clicked outside
    $(document).on('click', function (e) {
        if (!$menuButton.is(e.target) && $dropdownContent.is(':visible') && !$dropdownContent.is(e.target) && !$dropdownContent.has(e.target).length) {
            $dropdownContent.slideUp();
        }
    });

    // Save for Later functionality
    $('.save-icon').on('click', function () {
        const itemTitle = $(this).closest('.c-card').find('h2').text();

        // Toggle 'active' class and add item to savedItems
        $(this).toggleClass('active');
        if (!savedItems.includes(itemTitle)) {
            savedItems.push(itemTitle);
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
            alert(`You have saved ${savedItems.length} items for later.`);
        } else {
            alert('Item is already saved.');
        }
    });

    // Display saved items on the "Save for Later" page
    const $savedItemsContainer = $('#saved-items');
    if ($savedItemsContainer.length) {
        if (savedItems.length === 0) {
            $savedItemsContainer.html('<h2>No items saved yet.</h2>');
        } else {
            let itemsHtml = '<h2>Saved Items</h2>';
            savedItems.forEach(item => {
                itemsHtml += `<p>${item}</p>`;
            });
            $savedItemsContainer.html(itemsHtml);
        }
    } else {
        console.error("Element with ID 'saved-items' not found.");
    }

    // Like button functionality
    $('.like-btn').on('click', function () {
        const $likeButton = $(this).find('i');
        $likeButton.toggleClass('fa-heart fa-heart-o').css('color', $likeButton.hasClass('fa-heart') ? 'red' : '');
    });

    // Rotate reviews on the about page
    function rotateReviews() {
        const $reviewContainer = $('.review-container');
        if (!$reviewContainer.length) {
            console.error("Review container not found.");
            return;
        }

        function showNextReview() {
            $reviewContainer.empty(); // Clear current reviews
            const reviewText = reviews[currentReviewIndex];
            $('<div class="review active"><p>' + `"${reviewText}"` + '</p></div>').appendTo($reviewContainer); // Append next review
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length; // Cycle through reviews
        }

        showNextReview(); // Show the first review initially
        setInterval(function () {
            $('.review').fadeOut(1000, showNextReview); // Fade out, then show next review
        }, 4000); // Rotate every 4 seconds
    }
    rotateReviews();

    // Review submission functionality
    $('#review-form').submit(function (e) {
        e.preventDefault();
        const reviewInput = $('#review').val().trim();
        const wordCount = reviewInput.split(/\s+/).filter(Boolean).length;

        if (wordCount <= 15) {
            if (reviews.length < 10) {
                reviews.push(reviewInput); // Add new review
                localStorage.setItem('reviews', JSON.stringify(reviews)); // Save reviews to localStorage
                $('<div class="review"><p>' + `"${reviewInput}"` + '</p></div>').appendTo('.about-page-reviews');
                $('#review').val(''); // Clear input field
                rotateReviews(); // Restart the review rotation
            } else {
                alert('Maximum of 10 reviews reached. Please delete an old review to add a new one.');
            }
        } else {
            alert('Please enter a review with 15 words or fewer.');
        }
    });

    // Bounce effect for menu icon
    $menuButton.hide().delay(500).show('bounce', { times: 3 }, 1000);
});
