function iconifyCSS( nBorderW, nBorderH, nIconW, nIconH, nRows, nCols, aNames, sURL){
    var aRtn = new Array();
    for(var c=0; c<nCols; c++){
        for( var r=0,x=nBorderW,y=nBorderH,name='',i=0; r<nRows; r++){
            x = c*(nIconW+nBorderW) + nBorderW + 3;
            y = r*(nIconH+nBorderH) + nBorderH + 3;
            i=c+(r*nCols);
            name = aNames[i];
            aRtn.push('.file-' + name + '-icon{\n    background:url('+ sURL +') no-repeat '+ x*-1 +'px '+ y*-1 + 'px;\n    width:' + nIconW + 'px;\n    height:' + nIconH + 'px;\n    border:none;\n}');
        }
    }
    return aRtn;
}
var aFileTypes = [
    'rtf','aiff','mp4','mp2','mp3','ttf','jif','cur','adp','vtf',
    'wmv','wri','cue','ade','wma','m4a','pptx','docx','dda','mov',
    'psd','dat','bat','nfo','dic','diz','mp2v','rar','ifo','xls',
    'xsl','mdl','hlp','mpeg','ico','dll','ac3','ra','fon','reg',
    'xml','cal','mmm','asf','hst','mmf','dcr','ace','tlb','iso',
    'pdf','tiff','ppt','txt','java','log','zip','wad','theme','msp',
    'gif','xps','wav','xlsx','bup','bmp','png','der','cat','doc',
    'cab','torrent','ini','bin','vob','ai','spr','ani','jpg','au',
    'avi','inf','dwt','mid','html','dwg','css','bsp','wpl','divx',
    'php','url','dvd','gam'
    
];
iconifyCSS( 5, 5, 50, 50, 10, 10, aFileTypes, '../img/file_icons_vs_2_full.png').join('\n\n');

