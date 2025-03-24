// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {
    $("#card-title").text(`${name}`);
    $("#card-content").text(`You are Denial is a River because pisces often navigate complex emotional currents`);

    let selectedBG = '#BDB890';
    let selectedName = '#7E7B60';
    let selectedText = '#303030';
    // Color change on button click
    $(".color-btn").click(function () {
        $(".color-btn").removeClass("selected");

        selectedBG = $(this).data("bg");
        selectedName= $(this).data("title");
        selectedText = $(this).data("text");

        $(this).addClass("selected");
        $(".vibe-card").css({ "background-color": selectedBG, "color": selectedText });
        $("#card-song").css("color", selectedText);
        $("#card-name").css( "color", selectedName);
    });

    $('#download-btn').click(function () {
        const card = document.querySelector("#vibe-card");

        // Store original border radius
        const originalBorderRadius = card.style.borderRadius;

        // Temporarily remove border radius
        card.style.borderRadius = "0";

        html2canvas(card, {
            scale: 4,
            backgroundColor: selectedBG
        }).then(canvas => {
            // Revert border radius back
            card.style.borderRadius = originalBorderRadius;

            var link = document.createElement('a');
            link.download = 'vibe-card.png';
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });
});

