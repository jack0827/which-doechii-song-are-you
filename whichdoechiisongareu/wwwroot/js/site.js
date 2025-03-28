// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {

    // on start

    $('#dc-up').show(800);
    $('#dc-down').show(800);
    $('#app-logo').show(1000);
    $('#tap-anywhere').show(500);
    $('.footer').fadeIn(2200);

    const text = "tap anywhere to start";
    let i = 0;

    function type() {
        if (i < text.length) {
            $("#tap-anywhere").append(text.charAt(i));
            i++;
            setTimeout(type, 50);
        }
    }

    type();

    function swayLeft() {
        $('.sway-left').css('transform', 'rotate(3deg)');
        setTimeout(() => {
            $('.sway-left').css('transform', 'rotate(-3deg)');
        }, 700);
        setTimeout(swayLeft, 1400);
    }

    function swayRight() {
        $('.sway-right').css('transform', 'rotate(-3deg)');
        setTimeout(() => {
            $('.sway-right').css('transform', 'rotate(3deg)');
        }, 700);
        setTimeout(swayRight, 1400);
    }

    swayLeft();
    swayRight();

    // on start + mouse down events

    const sound = document.getElementById("click-sound");

    $(document).on("mousedown", function (event) {

        if ($("#dc-up").is(":visible")) {
            $("#dc-up").hide(1000);
            $("#dc-down").hide(1000);
            $("#tap-anywhere").hide(1000);
            $(".sign-btn").removeClass("selected");

            var screenWidth = $(window).width();
            var screenHeight = $(window).height();

            if (screenWidth <= 360) {
                $("#app-logo").animate({ width: '110px', top: '10' }, 500);
                $(".sign-btn").css({ width: '90px' });
                $("#if-name").css({ marginTop: '50px' });
            }
            else if (screenWidth <= 390 && screenWidth > 360) {
                $("#app-logo").animate({ width: '120px', top: '35' }, 500);
                $(".sign-btn").css({ width: '88px' });
                $("#card-img").css({ top: '18%' });

                //  if (screenHeight <= 700) {
                //        $("#app-logo").animate({ width: '100px', top: '40' }, 500);
                //       $(".sign-btn").css({ width: '85px' });



                //  }
            }
            else if (screenWidth <= 480 && screenWidth > 390) {
                $("#app-logo").animate({ width: '120px', top: '70' }, 500);
            }
            else if (screenWidth <= 768 && screenWidth > 480) {
                $("#app-logo").animate({ width: '120px', top: '40' }, 500);
            }
            else {
                $("#app-logo").animate({ width: '150px', top: '60' }, 500);
            }

            $(".input-group").fadeIn(1000);
        }

        sound.currentTime = 0;
        sound.play();
    });

    // 'input name and star sign' selection events

    let selectedSign = "";

    $(".sign-btn").on("click", function () {
        $(".sign-btn").removeClass("selected");
        $(this).addClass("selected");
        selectedSign = $(this).data("value");

        checkInputAndShowButton();
    });

    $("#if-name").on("input", function () {
        checkInputAndShowButton();
    });

    function checkInputAndShowButton() {
        const name = $("#if-name").val().trim();
        if (name !== "" && selectedSign !== "") {
            $("#app-btn").addClass("visible");
        } else {
            $("#app-btn").removeClass("visible");
        }
    }

    // 'see results' events
    $("#app-btn").on("click", function () {
        $("#app-btn").removeClass("visible");
        $(".sign-btn").removeClass("selected");
        $(".input-group").hide();
        //  $("#loading-text").fadeIn();
        //  $("#vibe-card").hide();
        $("#app-logo").fadeOut(500);

        const name = $("#if-name").val().trim();

        if (name && selectedSign) {
            $.ajax({
                type: "POST",
                url: "?handler=GenerateVibe",
                contentType: "application/json",
                data: JSON.stringify({ Name: name, StarSign: selectedSign }),
                success: function (response) {
                    //   $("#loading-text").fadeOut();
                    let aiResponse = response.trim();
                    let match = aiResponse.match(/You are (.*?) because/);
                    let song = match ? match[1].trim() : "Unknown Song";

                    $("#card-name").text(`${name}`);
                    $("#card-song").html(`⋆ <i>${song}</i> ⋆`);
                    $("#card-content").text(response);
                    $("#vibe-card").fadeIn(1000);
                    $(".btn-group").fadeIn(1000);
                    $(".color-picker").fadeIn(1000);
                },
                error: function (xhr, status, error) {
                    console.error("XHR:", xhr);
                    console.error("Status:", status);
                    console.error("Error:", error);
                    alert("Something went wrong. Check console.");
                }
            });
        }
    });

    // 'image color picker' events

    let selectedBG = '#BDB890';
    let selectedName = '#7E7B60';
    let selectedText = '#303030';

    $(".color-btn").click(function () {
        $(".color-btn").removeClass("selected");

        selectedBG = $(this).data("bg");
        selectedName = $(this).data("title");
        selectedText = $(this).data("text");

        $(this).addClass("selected");
        $(".vibe-card").css({ "background-color": selectedBG, "color": selectedText });
        $("#card-song").css("color", selectedText);
        $("#card-content").css("border-color", selectedText);
        $("#card-name").css("color", selectedName);
    });

    // 'download' events

    $('#download-btn').click(function () {
        const card = document.querySelector("#vibe-card");

        const originalBorderRadius = card.style.borderRadius;
        card.style.borderRadius = "0";

        html2canvas(card, {
            scale: 4,
            backgroundColor: selectedBG
        }).then(canvas => {
            card.style.borderRadius = originalBorderRadius;

            var link = document.createElement('a');
            link.download = 'doechii-vibe-card.png';
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });

    // 'try again' events

    $('#try-btn').on("click", function () {

        $("#vibe-card").hide();
        $(".btn-group").hide();
        $(".color-picker").hide();
        $("#app-logo").fadeIn(500);
        $("#if-name").val("");
        $(".sign-btn").removeClass("selected");
        $(".input-group").fadeIn();
        $("#app-btn").removeClass("visible");

        selectedSign = "";

    });

});


