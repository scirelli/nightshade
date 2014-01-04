if( oIndex === undefined ) var oIndex = new Object();

var aBrowserVersion = navigator.sayswho || [],
    sBrowName       = aBrowserVersion[0] || '',
    sBrowVer        = aBrowserVersion[1] || '0.0',
    fMinVersion     = 3.5;

//Firefox browser check
if( sBrowName.toLowerCase() == 'firefox' && parseFloat(sBrowVer) < fMinVersion ){
    //alert('VS is optimized to run in Firefox, Chrome, or Safari. Please use a supported browser.');
    $j('#topContainer').hide().html('');
    $j('#middleContainer').hide().html('');
    $j('#badFF').show();
    $j('#badFF').css('visibility','visible');
    $j('body').css('background-color','#eeeeee');
    try{
        console.log('FF <' + fMinVersion);
    }catch(e){
        var console = {log:function(){}};
    }
    throw 'VS does not support FF < 3.5.';
}

//Resizing the frame
$j(document).ready(function(){
    function resizeCenterFrame( ){
        var windowH          = $j('#modulBtnContainer.span1').height(),
            topContainerH    = $j('#topContainer').height(),
            $middleContainer  = $j('#middleContainer iframe'),
            middleContainerH = $middleContainer.height();
        middleContainerH =  windowH; 
        console.log('Middle resized to: ' + middleContainerH + 'px.');
        $middleContainer.height(middleContainerH);
    };

    $j(window).resize(function(){
        resizeCenterFrame();
        //justifyButtons();
    });
    $j(window).resize();
});

;(function(oIndex, $){
    //Clicking on a button
    $(document).ready(function(){
        $('#modulBtnContainer button').click(function(e){
            //Need to change the button>img to use a class and not an img
            var $itm = $(this);

            //If active then reload
            if( $itm.hasClass('active') ) {
                var $iframe = $('#middleContainer iframe');
                $iframe = $iframe.get(0);
                $iframe.contentWindow.location.reload();
                e.preventDefault();
                return false;
            }

            $('#modulBtnContainer button').each( function(index){
                var $itm = $(this);
                $itm.removeClass('active');
            });
            $itm.addClass('active');
            $('#middleContainer iframe').attr('src',$('a',$itm).attr('href') + window.location.search);

            localStorage.setItem('sVSBannerLastClicked', $itm.attr('id') );
            e.preventDefault();
            return false;
        });
        var sLastActive = localStorage.getItem('sVSBannerLastClicked') || 'email';
        $('#'+sLastActive).click();
    });

    //Feedback link
    $(document).ready(function(){
        var $a = $('div#feedback a'),
            $iframe = $('#middleContainer iframe');
        $iframe.load(function(evt){
            var cw        = this.contentWindow,
                oVSClient = null,
                bm        = null, 
                slink     = '',
                sEmail    = $a.attr('href') + '&body=';

            if( cw && cw.vs && cw.vs.OnBookmarkClick && cw.globals && cw.globals.oVSClient ){
                oVSClient = cw.globals.oVSClient,
                bm        = new cw.vs.OnBookmarkClick( oVSClient ),//Just need the createBookmarkURL from here.
                slink     = 'User was at this location <' + bm.createBookmarkURL() + '>';
            }else{
                slink = 'Could not determine users location.';
            }
            sEmail +=  encodeURIComponent(slink);

            $a.click( function(e){
                window.open( sEmail, 'Feedback' );
                $(this).preventDefault();
                return false;
            });
        });;
    });
})(oIndex, jQuery);
