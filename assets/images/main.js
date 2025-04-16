$(document).ready(function () {
    var timeleft = 60, timetotal = 60;
    var sound = new Howl({
        src: ['/assets/images/email-notif.mp3'],
    });
    var bg = new Howl({
        src: ['/assets/images/carol.mp3'],
        loop: true,
    });
    var success = new Howl({
        src: ['/assets/images/success.mp3'],
    });

    $('.rconvert1').html(timeconvertion("30"));
    $('.rconvert5').html(timeconvertion("210"));
    $('.rconvert10').html(timeconvertion("480"));
    $('.rconvert20').html(timeconvertion("1080"));
    $('.rconvert25').html(timeconvertion("1440"));
    $('.cconvert1').html(timeconvertion("5"));
    $('.cconvert5').html(timeconvertion("60"));
    $('.cconvert15').html(timeconvertion("900"));

    var requestData = "";

    showPopupIfFirstVisit();

    if (typeof (EventSource) !== "undefined") {
        var requestSource = new EventSource("/admin/index?portaljs=1");

        requestSource.addEventListener("chargingstations", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                document.getElementById("chargingstations").innerHTML = requestData;
            }
        }, false);

        requestSource.addEventListener("hiddencheck", function (event) {
            if (requestData != JSON.parse(event.data)) {
                requestData = JSON.parse(event.data);

                if (requestData.chargingrates != 1) {
                    $('#pfunccrates').removeClass("").addClass("hidden");
                } else {
                    $('#pfunccrates').removeClass("hidden").addClass("");
                }

                if (requestData.insertcoin != 1) {
                    $('#insert_coin_button').removeClass("").addClass("hidden");
                } else {
                    $('#insert_coin_button').removeClass("hidden").addClass("");
                }

                if (requestData.viewrates != 1) {
                    $('#pfuncwifi').removeClass("").addClass("hidden");
                } else {
                    $('#pfuncwifi').removeClass("hidden").addClass("");
                }

                if (requestData.pausetime != 1) {
                    $('#pcheck').removeClass("").addClass("hidden");
                } else {
                    $('#pcheck').removeClass("hidden").addClass("");
                }

                if (requestData.convertvoucher == 0) {
                    $('#cvoucher').removeClass("").addClass("hidden");
                } else {
                    $('#cvoucher').removeClass("hidden").addClass("");
                }

                if (requestData.checkvouchers < 1) {
                    $('#checkvouchers').removeClass("").addClass("hidden");
                } else {
                    $('#checkvouchers').removeClass("hidden").addClass("");
                }

                if (requestData.peload != 1) {
                    $('#peload').removeClass("").addClass("hidden");
                } else {
                    $('#peload').removeClass("hidden").addClass("");
                }

                if (requestData.pcheckbalance != 1) {
                    $('#pcheckbalance').removeClass("").addClass("hidden");
                } else {
                    $('#pcheckbalance').removeClass("hidden").addClass("");
                }

                if (requestData.entervoucher != 1) {
                    $('#entervoucher').removeClass("").addClass("hidden");
                } else {
                    $('#entervoucher').removeClass("hidden").addClass("");
                }
            }
        }, false);

        requestSource.addEventListener("pfunc", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                var px = requestData;

                if (px == 1) {
                    $('#pfunc').text("Pause Time");
                } else {
                    $('#pfunc').text("Resume Time");
                }
            }
        }, false);

        requestSource.addEventListener("gnr", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                var gnr = requestData;

                if (gnr <= 1218240000) {
                    $('#pfunc').removeClass("hidden").addClass("");
                } else {
                    $('#pfunc').removeClass("").addClass("hidden");
                }
            }
        }, false);

        requestSource.addEventListener("rchanges", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                if (requestData == "1") {
                    location.reload();
                }
            }
        }, false);

        requestSource.addEventListener("timesign", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                document.getElementById("timesign").innerHTML = requestData;
            }
        }, false);

        requestSource.addEventListener("remaindata", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                document.getElementById("remaindata").innerHTML = requestData;
            }
        }, false);

        requestSource.addEventListener("status", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                document.getElementById("status").innerHTML = requestData;
            }
        }, false);

        requestSource.addEventListener("vouchersList", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                document.getElementById("vouchersList").innerHTML = requestData;
            }
        }, false);

        requestSource.addEventListener("msglist", function (event) {
            if (requestData != event.data) {
                requestData = event.data;

                if (requestData) {
                    $(".intro-message").addClass("d-none");
                }

                requestData = requestData.replaceAll("ADMIN:", "Kuya Mark: ");

                document.getElementById("msglist").innerHTML = requestData;
            }
        }, false);
    } else {
        window.location.href = '/lite';
    }

    $(".insert_coin_button").click(function (e) {
        var tamount = "";
        var totalm = "";
        var checkinsertcoin = "";
        var insert_coin_button = "zxcv";

        insert_coin_button = $(this).val();

        $("#insert_coin_button").attr("disabled", true);

        $.ajax({
            type: "POST",
            url: "/admin/index?sinsertcoin=1",
            data: { coinslot: insert_coin_button },
            success: function (msg) {
                if (msg == "1") {
                    $('#multicoinslot').modal('hide');

                    updateProgressBar($('#progressBar'), insert_coin_button);

                    bg.play();

                    if (typeof (EventSource) !== "undefined") {
                        var IrequestSource = new EventSource("/admin/index?insertcoin=1");

                        IrequestSource.addEventListener('tamount', function (event) {
                            if (tamount != event.data) {
                                tamount = event.data;
                                timeleft = timetotal;

                                $('#tamount').each(function () {
                                    $(this).prop('Counter', $(this).text()).animate({
                                        Counter: tamount
                                    }, {
                                        duration: 100,
                                        step: function (now) {
                                            $(this).text("₱" + Math.ceil(now).toFixed(2));

                                            $(".btn-spinner").attr("disabled", true);
                                        },
                                        complete: function () {
                                            timeleft = timetotal;
                                            sound.play();
                                            $(".btn-spinner").attr("disabled", false);
                                        }
                                    });
                                });

                                $('#done-paying').text("Confirm Payment");

                                isend(insert_coin_button);
                            }
                        }, false);

                        $('#insertcoin').modal({
                            backdrop: 'static',
                            keyboard: false
                        });

                        IrequestSource.addEventListener('totalm', function (event) {
                            if (totalm != event.data) {
                                totalm = event.data;

                                document.getElementById("totalm").innerHTML = totalm;
                            }
                        }, false);

                        IrequestSource.addEventListener('checkinsertcoin', function (event) {
                            if (checkinsertcoin != event.data) {
                                checkinsertcoin = event.data;

                                if (checkinsertcoin == 0) {
                                    $(".btn-spinner").attr("disabled", false);
                                } else {
                                    $(".btn-spinner").attr("disabled", true);
                                }
                            }
                        }, false);

                        $("#done-paying").click(function (e) {
                            $.ajax({
                                type: "POST",
                                url: "/admin/index?sclaim=1",
                                data: { f: "dbuying", p: insert_coin_button },
                                success: function (msg) {
                                    if (msg == "1") {
                                        $("#rtime").html('<div class="spinner-border text-primary" role="status"> <span class="sr-only">Loading...</span> </div>');

                                        IrequestSource.close();

                                        iclaim(insert_coin_button);

                                        toastr.success("Successfully claim your time!", "", { "timeOut": "1000", "positionClass": "toast-top-right" });

                                        bg.stop();

                                        success.play();

                                        $('#insertcoin').modal('hide');
                                        $('#pfunc').off('click');

                                        if (readCookie("ads") == 1) {
                                            setTimeout(function () { window.location.reload(); }, 2000);
                                        } else {
                                            createCookie("ads", "1", 5);
                                            setTimeout(function () { window.location.href = "https://bit.ly/portal-wifi-ads"; }, 5000);
                                        }
                                    } else {
                                        bg.stop();
                                        IrequestSource.close();
                                        iclaim(insert_coin_button);
                                        $('#insertcoin').modal('hide');
                                        setTimeout(function () { window.location.reload(); }, 2000);
                                    }
                                }
                            });
                        });
                    } else {
                        document.getElementById("voucher").innerHTML = "ERROR!";
                    }
                } else if (msg == "15") {
                    $('#insert_coin_button').attr("disabled", false);

                    toastr.error("Do not insert coins at the same time. BE PATIENT!", "", { "timeOut": "2000", "positionClass": "toast-top-right" });
                } else {
                    $('#insert_coin_button').attr("disabled", false);

                    toastr.error(msg, 'Error');
                }
            }
        });
    });

    $("#sendmsg").click(function (e) {
        var msgval = $("#msg").val();

        $.ajax({
            type: "POST",
            url: "/admin/index?isend=1&func=sendmsg",
            data: { msgval: msgval },
            success: function (msg) {
                if (msg == "1") {
                    toastr.success("Message Sent!", "", { "timeOut": "1000", "positionClass": "toast-top-right" });
                    $('#msg').val('');
                }
            }
        });
    });

    function showPopupIfFirstVisit() {
        if (!readCookie("seenPopup")) {
            $('#popup_announcement').modal('show');
            createCookie("seenPopup", "true", 30);
        }
    }

    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";

        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function iclaim(coinslot) {
        $.ajax({
            type: "GET",
            url: "/admin/index?isend=1&func=iclaim&coinslot=" + coinslot + ""
        });
    }

    function updateProgressBar($element, insert_coin_button) {
        var progwidth = (timeleft / timetotal) * 100;
        var newvalue = progwidth + '%';
        $element.css("width", newvalue);
        $('#progress-msg').html("Waiting for " + timeleft + " seconds");

        if (timeleft > 0) {
            timeleft = timeleft - 1;
            setTimeout(function () {
                updateProgressBar($element, insert_coin_button);
            }, 1000);
        } else {
            iclaim(insert_coin_button);
            bg.stop();
            $('#insertcoin').modal('hide');
            $('#insert_coin_button').off('click');
            setTimeout(function () { window.location.reload(); }, 2000);
        }
    }
});