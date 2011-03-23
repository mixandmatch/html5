
if(!window.de)de={};
    
if(!window.de.allianz)de.allianz={};
    
if(!window.de.allianz.ifa)de.allianz.ifa={};
    
if(!window.de.allianz.ifa.agentursuche)de.allianz.ifa.agentursuche={};
    
var log;
var agsGlobal;
function createAndStartAgentursuche(pOptions){
    agsConfigureLogging();
    var agentursuche=new de.allianz.ifa.agentursuche.Agentursuche(pOptions);
    agsGlobal=agentursuche;
    agentursuche.run();
}
function agsConfigureLogging(){
    var logRoot=log4javascript.getRootLogger();
    var appender=new log4javascript.PopUpAppender();
    var layout=new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %-40c - %m%n");
    appender.setLayout(layout);
    logRoot.addAppender(appender);
    logRoot.setLevel(log4javascript.Level.OFF);
    log4javascript.setEnabled(false);
    var urlParams=agsGetUrlVars();
    if(urlParams.agsLogging){
        $.cookie('agsLogging',urlParams.agsLogging,{
            path:'/',
            expires:1
        });
    }
    var cookieAgsLogging=$.cookie('agsLogging');
    if(cookieAgsLogging==='true'){
        log4javascript.setEnabled(true);
        logRoot.setLevel(log4javascript.Level.ERROR);
        log4javascript.getLogger("de.allianz.ifa.agentursuche.Agentursuche").setLevel(log4javascript.Level.TRACE);
        log4javascript.getLogger("de.allianz.ifa.agentursuche.PtvMap").setLevel(log4javascript.Level.TRACE);
        log4javascript.getLogger("de.allianz.ifa.agentursuche.RouteService").setLevel(log4javascript.Level.TRACE);
        log4javascript.getLogger("de.allianz.ifa.agentursuche.PtvMiniMap").setLevel(log4javascript.Level.TRACE);
    }
    logRoot.info("Logging loaded and configured.");
}
function agsGetUrlVars()
{
    var vars=[],hash;
    var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
    for(var i=0;i<hashes.length;i++)

    {
        hash=hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]]=hash[1];
    }
    return vars;
}
if(!window.de.allianz.ifa.agentursuche)de.allianz.ifa.agentursuche={};
    
de.allianz.ifa.agentursuche.Agentursuche=function(pConfig){
    var self=this;
    var log=log4javascript.getLogger("de.allianz.ifa.agentursuche.Agentursuche");
    log.debug("create Agentursuche");
    var config={
        pageSize:5
    };
    
    $.extend(config,pConfig||{});
    if(typeof(config.portletResourceURL)=='undefined')log.error("Es wurde keine portletResourceURL definiert.");
    if(typeof(config.urlPathPrefix)=='undefined')log.error("Es wurde kein urlPathPrefix definiert.");
    if(typeof(config.mapId)=='undefined')log.error("Es wurde keine ID fuer die Karten Div-Box definiert.");
    if(typeof(config.locationsearchPocurl)=='undefined')log.error("Es wurde keine Poc-URL fuer die Filialsuche definiert.");
    log.debug("Config: "+JSON.stringify(config));
    var ptvMap;
    this.run=function(){
        log.trace("run()");
        ptvMap=new de.allianz.ifa.agentursuche.PtvMap(config);
        ptvMap.create(initAfterPtvInitialisation);
    };
    
    var initAfterPtvInitialisation=function(){
        log.trace("initAfterPtvInitialisation()");
        if(config.agenturSucheMetaData&&config.agenturSucheMetaData.searchType=='ADDRESS'){
            ptvMap.setSearchPosition(config.agenturSucheMetaData.addressLat,config.agenturSucheMetaData.addressLon);
        }
        log.debug("Check if there are pois");
        if(config.agencyList){
            log.debug("Create POIs ("+config.agencyList.length+")");
            for(i=0;i<config.agencyList.length;i++){
                var agency=config.agencyList[i];
                log.trace("Agency: ",JSON.stringify(agency));
                ptvMap.addAllianzPOI(agency);
            }
            }
    ptvMap.showAllPois();
    ptvMap.showAgenciesForPage(1);
    log.info("Agentursuche fertig gestartet. Ab jetzt nur noch Async-Ergenisse bzw. Benutzeraktionen.");
};

this.centerPoi=function(pId){
    log.trace("centerPoi()",pId);
    ptvMap.centerPoi(pId);
};

this.showAllPois=function(){
    log.trace("showAllPois()");
    ptvMap.showAllPois();
};

this.routeToPoi=function(pId){
    log.trace("routeToPoi()",pId);
    ptvMap.routeToPoi(pId);
};

this.searchLocations=function(pId){
    log.trace("searchLocations()",pId);
    var newUrl=config.locationsearchPocurl;
    newUrl+='&agencyLocation='+pId;
    log.debug('New url for location search:',newUrl);
    window.location.href=newUrl;
};

this.showAgenciesForPage=function(pPageNumber){
    log.trace("showAgenciesForPage()",pPageNumber);
    ptvMap.showAgenciesForPage(pPageNumber);
};

};

if(!window.de.allianz.ifa.agentursuche)de.allianz.ifa.agentursuche={};
    
de.allianz.ifa.agentursuche.PtvMap=function(pConfig){
    var self=this;
    var log=log4javascript.getLogger("de.allianz.ifa.agentursuche.PtvMap");
    log.debug("Erstelle Instanz");
    var config={
        agencyImageDefault:'https://fachmann.allianz.de/ebiz_app/hpanewressource/-2?ImagebuilderId=hpanewressource_config.ressource',
        initialZoomLevel:18,
        defaultZoomLevel:11,
        defaultZoomLevelDetail:7,
        urlPathStatic:'/static-resources/global/adag2008/images/icons/'
    };
    
    $.extend(config,pConfig||{});
    if(typeof(config.mapId)=='undefined')log.error("Es wurde keine ID fuer die Karten Div-Box definiert.");
    if(typeof(config.ptvProxyServletUrl)=='undefined')log.error("Es wurde keine PTV-Login-Proxy definiert.");
    if(typeof(config.homepageUrlPrefix)=='undefined')log.error("Es wurde kein Homepage-Prefix definiert.");
    if(typeof(config.agencyImageUrlPrefix)=='undefined')log.error("Es wurde kein VT-Bild Prefix definiert.");
    log.debug("Config:",JSON.stringify(config));
    var POI_CATEGORY_AGENCY='AGENCY';
    var poiMap={};
    
    var map;
    var vLayer;
    var currentBusinessCardPoiId;
    var util=new de.allianz.ifa.agentursuche.PtvMapUtil({
        mapId:config.mapId
        });
    var routeService;
    var searchPosition;
    var lastVisiblePageNumber;
    var businesscardCreater=new de.allianz.ifa.agentursuche.BusinesscardCreater(config);
    this.create=function(pCallback){
        log.trace("create()");
        try{
            log.trace("Save current server path.");
            var currentServerPath=com.ptvag.mnp.ServerSettings.serverPathPrefix;
            log.trace("PTV currentServerPath: "+currentServerPath);
            log.trace("Ersetze mit ProxyServlet");
            com.ptvag.mnp.ServerSettings.serverPathPrefix=config.ptvProxyServletUrl+currentServerPath;
            log.trace("Proxy Servlet URL:",com.ptvag.mnp.ServerSettings.serverPathPrefix);
            log.trace("Erstelle neuen Loginservice");
            var loginService=new com.ptvag.mnp.ajax.LoginService();
            com.ptvag.mnp.ServerSettings.serverPathPrefix=currentServerPath;
            log.trace("call Ptv login service.");
            loginService.login("dummyuser","dummypassword",function(){
                loginCallback();
                log.debug("call caller callback (given as parameter)");
                pCallback();
            });
            log.info("create() finished. Wait for PTV to call the AGS callback.");
        }catch(e){
            log.error("Error in loginCallback():",e);
        }
    };
    
var loginCallback=function(){
    log.trace("loginCallback()");
    log.debug("creating map with map container id:",config.mapId);
    map=new com.ptvag.webcomponent.map.Map(document.getElementById(config.mapId));
    map.setBackendServer("Europe");
    log.debug("configure layers (enable/disable).");
    map.getLayer("toolbar").setEnabled(false);
    map.getLayer("copyright").setEnabled(false);
    map.setAllowMouseWheelZoom(false);
    map.setProfileGroup('pastell');
    map.setZoom(config.initialZoomLevel);
    vLayer=map.getLayer("vector");
    vLayer.setFlexAtSamePosition(true);
    log.info("change InfoBoxElementFactory to use custom close icon.")
    log.debug("close button icon:",config.urlPathStatic+'closebox.gif');
    var factory=com.ptvag.webcomponent.map.vector.InfoBoxElementFactory;
    var origActivateCloseWidget=factory.activateCloseWidget;
    factory.activateCloseWidget=function(infoBoxElement){
        var imgElements=infoBoxElement.getElementsByTagName("img");
        var closeWidgetElement=imgElements[imgElements.length-1];
        closeWidgetElement.src=config.urlPathStatic+'closebox.gif';
        closeWidgetElement.width=14;
        closeWidgetElement.height=14;
        origActivateCloseWidget.apply(this,arguments);
    };
    
    log.info("PtvMap initialized.");
};

var changeZoomCallback=function(pObject){
    log.trace("Zoom changed");
};

var changeCenterCallback=function(pObject){
    log.trace("Center changed");
};

this.dispose=function(){
    map.dispose();
};

this.setSearchPosition=function(pLat,pLon){
    log.trace("setSearchPosition(pLat, pLon)",pLat,pLon);
    searchPosition={};
    
    searchPosition.lat=pLat;
    searchPosition.lon=pLon;
    var pointSu=util.convertPoiToSuCoordinates({
        'lat':pLat,
        'lon':pLon
    });
    searchPosition.suX=pointSu.x;
    searchPosition.suY=pointSu.y;
    var idImage=util.createId('SearchPositionId',util.IMAGE);
    if(!vLayer.elementExists(idImage)){
        var url=config.urlPathPrefix+config.urlPathStatic+"0.gif";
        var image=new com.ptvag.webcomponent.map.vector.ImageMarker(searchPosition.suX,searchPosition.suY,url,null,null,idImage,false);
        vLayer.addElement(image);
    }
};

this.addAllianzPOI=function(pPoi){
    log.debug("addAllianzPOI()",pPoi.id);
    if(log.isTraceEnabled())log.trace("Poi:",JSON.stringify(pPoi));
    try{
        var pointSu=util.convertPoiToSuCoordinates(pPoi);
        pPoi.suX=pointSu.x;
        pPoi.suY=pointSu.y;
        poiMap[pPoi.id]=pPoi;
        var idImage=util.createId(pPoi.id,util.IMAGE);
        var idText=util.createId(pPoi.id,util.TEXT);
        var idHover=util.createId(pPoi.id,util.HOVER);
        var idClick=util.createId(pPoi.id,util.CLICK);
        if(!vLayer.elementExists(idImage)){
            log.trace("Create image for poi",pPoi.id);
            var urlPrefix=config.urlPathPrefix+config.urlPathStatic;
            var urlPostfix=".gif"
            var url=urlPrefix+pPoi.resultPosition+urlPostfix;
            var image=new com.ptvag.webcomponent.map.vector.ImageMarker(pPoi.suX,pPoi.suY,url,34,null,idImage,true);
            vLayer.addElement(image);
        }
        if(false){
            log.trace("Create text for poi",pPoi.id);
            var text=new com.ptvag.webcomponent.map.vector.Text();
            text.setId(idText);
            text.setText(pPoi.name);
            text.setX(pPoi.suX);
            text.setY(pPoi.suY);
            text.setPixelSize(10);
            text.setColor("rgba(0, 0, 255, 0.75)");
            text.setAlignment(150);
            text.setMaxZoom(10);
            text.setMinZoom(15);
            vLayer.addElement(text);
        }
        if(!vLayer.elementExists(idClick)){
            log.trace("Create click area for poi",pPoi.id);
            var click=new com.ptvag.webcomponent.map.vector.ClickArea(pPoi.suX,pPoi.suY,null,12,clickCallback,0,idClick,true);
            click.setDependsOn(idImage);
            vLayer.addElement(click);
        }
    }catch(e){
    log.error("Error in addAllianzPOI():",e);
}
};

this.centerPoi=function(pPoiId){
    try{
        log.trace("centerPoi()",pPoiId);
        if(currentBusinessCardPoiId!=null){
            hideBusinesscard(currentBusinessCardPoiId);
        }
        var poi=poiMap[pPoiId];
        var pointSu={
            x:poi.suX,
            y:poi.suY
            };
            
        map.setZoom(config.defaultZoomLevelDetail);
        map.setViewToPoints([pointSu],false,true);
        showBusinesscard(pPoiId);
    }catch(e){
        log.error("Error in centerPoi():",e);
    }
};

var closeInfoboxCallback=function(pInfoboxObject){
    try{
        log.trace("closeInfoboxCallback for: "+pInfoboxObject.getId());
        var poiId=util.extractPoiId(pInfoboxObject.getId(),util.BUSINESSCARD);
        hideBusinesscard(poiId);
        currentHoverElementId=null;
    }catch(e){
        log.error("Error in closeInfoboxCallback():",e);
    }
};

var showBusinesscard=function(pPoiId){
    log.trace("showBusinesscard() for "+pPoiId);
    var poi=poiMap[pPoiId];
    log.trace("Poi: "+JSON.stringify(poi));
    var businesscardHtml=businesscardCreater.getBusinesscardHtml(poi);
    log.debug("Create InfoBox for ",poi.id);
    var infobox=new com.ptvag.webcomponent.map.vector.InfoBox(poi.suX,poi.suY,businesscardHtml,0,0,util.createId(pPoiId,util.BUSINESSCARD),false);
    infobox.setShowCloseWidget(true);
    infobox.setCloseWidgetHandler(closeInfoboxCallback);
    vLayer.addElement(infobox);
    currentBusinessCardPoiId=pPoiId;
};

var hideBusinesscard=function(pPoiId){
    log.trace("hideBusinesscard()",pPoiId)
    var businesscardId=util.createId(pPoiId,util.BUSINESSCARD);
    vLayer.getElement(businesscardId).dispose();
    vLayer.removeElement(businesscardId);
    currentBusinessCardPoiId=null;
};

this.showAllPois=function(){
    log.trace("showAllPois()");
    if(currentBusinessCardPoiId!=null){
        hideBusinesscard(currentBusinessCardPoiId);
    }
    if(routeService!=null){
        routeService.removeRouteFromMap();
    }
    var pointList=new Array();
    for(var key in poiMap){
        var poi=poiMap[key];
        var pointSu={
            x:poi.suX,
            y:poi.suY
            };
            
        pointList.push(pointSu);
    }
    if(searchPosition!=null){
        var pointSu={
            x:searchPosition.suX,
            y:searchPosition.suY
            };
            
        pointList.push(pointSu);
    }
    if(pointList.length>0){
        map.setViewToPoints(pointList);
        if(searchPosition!=null&&pointList.length==1){
            log.debug("Zoom out to level",config.defaultZoomLevel);
            map.setZoom(config.defaultZoomLevel);
        }
    }else{
    log.debug("Point list is empty. Nothing to show.");
}
};

var clickCallback=function(pClickObject){
    try{
        log.trace("click for: ",pClickObject.id);
        var poiId=util.extractPoiId(pClickObject.id,util.CLICK);
        if(poiId==currentBusinessCardPoiId){
            hideBusinesscard(poiId);
            return;
        }
        if(poiId!=currentBusinessCardPoiId){
            if(currentBusinessCardPoiId!=null){
                hideBusinesscard(currentBusinessCardPoiId);
            }
            showBusinesscard(poiId);
        }
    }catch(e){
    log.error("Error in clickCallback():",e);
}
};

this.routeToPoi=function(pId){
    log.trace("routeToPoi()",pId);
    if(currentBusinessCardPoiId!=null){
        hideBusinesscard(currentBusinessCardPoiId);
    }
    if(routeService==null){
        routeService=new de.allianz.ifa.agentursuche.RouteService({
            map:map
        });
    }
    var addresses=new Array();
    var startAddress={};
    
    var destAddress={};
    
    log.debug("Set the search address as start address.");
    startAddress.lat=searchPosition.lat;
    startAddress.lon=searchPosition.lon;
    log.warn("Search address is only available if the agenturSucheMetaData config is available in the PtvMap object");
    startAddress.zipcode=config.agenturSucheMetaData.searchedAddress.streetNumber;
    startAddress.city=config.agenturSucheMetaData.searchedAddress.city;
    startAddress.street=config.agenturSucheMetaData.searchedAddress.street;
    addresses.push(startAddress);
    var poi=poiMap[pId];
    destAddress.zipcode=poi.postalCode;
    destAddress.city=poi.city;
    destAddress.street=poi.street;
    destAddress.lat=poi.lat;
    destAddress.lon=poi.lon;
    addresses.push(destAddress);
    routeService.doRouting(addresses);
};

var printIfAvaiable=function(pValue,pPrefix,pPostfix){
    log.trace("printIfAvaiable()");
    var resultString="";
    var valueAvailable=true;
    if(!pValue){
        valueAvailable=false;
    }
    else if(typeof pValue=="string"){
        if($.trim(pValue).length==0){
            valueAvailable=false;
        }
    }
if(valueAvailable===true){
    if(pPrefix!=null){
        log.trace("prefix:",pPrefix);
        resultString=pPrefix;
    }
    resultString+=pValue;
    if(pPostfix!=null){
        log.trace("postfix:",pPostfix);
        resultString+=pPostfix;
    }
}
log.trace("printIfAvaiable:",resultString);
return resultString;
};

this.showAgenciesForPage=function(pPageNumber){
    log.trace("showAgenciesForPage()",pPageNumber);
    lastVisiblePageNumber=pPageNumber;
    if(currentBusinessCardPoiId!=null){
        hideBusinesscard(currentBusinessCardPoiId);
    }
    if(routeService!=null){
        routeService.removeRouteFromMap();
    }
    var agenciesToDisplay=new Array();
    var minResultPosition=1+(pPageNumber-1)*config.pageSize;
    var maxResultPosition=minResultPosition+config.pageSize-1;
    log.trace("vLayer.removeAllElements() to add only the agencies of the current page");
    vLayer.removeAllElements();
    for(var key in poiMap){
        var poi=poiMap[key];
        if(poi.resultPosition>=minResultPosition&&poi.resultPosition<=maxResultPosition){
            this.addAllianzPOI(poi);
            var pointSu={
                x:poi.suX,
                y:poi.suY
                };
                
            agenciesToDisplay.push(pointSu);
        }
    }
if(searchPosition!=null){
    this.setSearchPosition(searchPosition.lat,searchPosition.lon);
    var pointSu={
        x:searchPosition.suX,
        y:searchPosition.suY
        };
        
    agenciesToDisplay.push(pointSu);
}else{
    log.trace("searchPosition is null");
}
if(agenciesToDisplay.length>0){
    if(searchPosition!=null&&agenciesToDisplay.length==1){
        log.debug("Zoom out to level",config.defaultZoomLevel);
        map.setZoom(config.defaultZoomLevel);
    }else{
        map.setViewToPoints(agenciesToDisplay);
    }
}else{
    log.debug("Point list is empty. Nothing to show.");
}
};

};

de.allianz.ifa.agentursuche.PtvMapUtil=function(pConfig){
    var log=log4javascript.getLogger("de.allianz.ifa.agentursuche.PtvMapUtil");
    log.debug("Erstelle Instanz");
    var config=pConfig||{};
    
    if(typeof(config.mapId)=='undefined')log.error("Es wurde keine mapId definiert. Es koennen keine Unique IDs erzeugt werden.");
    this.IMAGE="image";
    this.TEXT="text";
    this.HOVER="hover";
    this.CLICK="click";
    this.BUSINESSCARD="businesscard";
    this.convertPoiToSuCoordinates=function(pPoi){
        log.trace("convertPoiToSuCoordinates()");
        var point={
            x:pPoi.lon,
            y:pPoi.lat
            };
            
        var coordinateSmartUnit=com.ptvag.webcomponent.map.CoordUtil.geoDecimal2SmartUnit(point);
        return coordinateSmartUnit;
    };
    
    this.createId=function(pPoiId,pType){
        log.trace("createId()",pPoiId,pType);
        var id;
        if(pType==this.IMAGE){
            id=config.mapId+'_'+pPoiId+'_'+this.IMAGE;
        }
        if(pType==this.TEXT){
            id=config.mapId+'_'+pPoiId+'_'+this.TEXT;
        }
        if(pType==this.HOVER){
            id=config.mapId+'_'+pPoiId+'_'+this.HOVER;
        }
        if(pType==this.CLICK){
            id=config.mapId+'_'+pPoiId+'_'+this.CLICK;
        }
        if(pType==this.BUSINESSCARD){
            id=config.mapId+'_'+pPoiId+'_'+this.BUSINESSCARD;
        }
        log.trace("==>",id);
        return id;
    };
    
    this.extractPoiId=function(pId,pType){
        log.trace("extractPoiId()",pId,pType);
        var idWithoutMap=pId.substring(config.mapId.length+1,pId.length);
        var id;
        if(pType==this.IMAGE){
            id=idWithoutMap.substring(0,idWithoutMap.length-this.IMAGE.length-1);
        }
        if(pType==this.TEXT){
            id=idWithoutMap.substring(0,idWithoutMap.length-this.TEXT.length-1);
        }
        if(pType==this.HOVER){
            id=idWithoutMap.substring(0,idWithoutMap.length-this.HOVER.length-1);
        }
        if(pType==this.CLICK){
            id=idWithoutMap.substring(0,idWithoutMap.length-this.CLICK.length-1);
        }
        if(pType==this.BUSINESSCARD){
            id=idWithoutMap.substring(0,idWithoutMap.length-this.BUSINESSCARD.length-1);
        }
        log.trace("==>",id);
        return id;
    };

};

de.allianz.ifa.agentursuche.RouteService=function(pConfig){
    var self=this;
    var log=log4javascript.getLogger("de.allianz.ifa.agentursuche.RouteService");
    log.debug("create RouteService");
    var config={};
    
    config.txtRouteTime="Gesch&auml;tzte Fahrtzeit";
    config.txtRouteDistance="Gesamtl&auml;nge der Strecke";
    config.txtDuration="Dauer";
    config.txtDistance="Entfernung";
    config.txtInstruction="Fahranweisung";
    config.txtDirection="Richtung";
    $.extend(config,pConfig||{});
    if(typeof(config.map)=='undefined')log.error("The map instance is needed.");
    var ptvRouteService=new com.ptvag.mnp.routeservice.RouteService(config.map);
    var addressList;
    var lastMappingResult;
    var miniMapList=new Array();
    this.doRouting=function(pAddresses){
        log.trace("doRouting()");
        if(lastMappingResult!=null){
            this.removeRouteFromMap();
        }
        addressList=pAddresses;
        var stationList=new Array();
        for(var i=0;i<pAddresses.length;i++){
            log.debug("add station with coordinates: ",i);
            var coordinate={
                "coordinateType":"GEODECIMAL"
            };
            
            coordinate.y=pAddresses[i].lat;
            coordinate.x=pAddresses[i].lon;
            var station={
                "class":"com.ptvag.mnp.common.Station",
                "className":"com.ptvag.mnp.common.Station"
            };
            
            station.coordinate=coordinate;
            if(log.isDebugEnabled()){
                log.debug("add station "+i+":",JSON.stringify(station));
            }
            stationList.push(station);
        }
        var routeResultOptions={
            "class":"com.ptvag.mnp.common.RouteResultOptions",
            "className":"com.ptvag.mnp.common.RouteResultOptions"
        };
        
        var routeOptions=new Array();
        var routeOption={
            "class":"com.ptvag.mnp.common.RouteOption",
            "className":"com.ptvag.mnp.common.RouteOption"
        };
        
        routeOption.parameter="ROUTE_LANGUAGE";
        routeOption.option="DE";
        routeOptions.push(routeOption);
        var imageProps={
            "class":"com.ptvag.mnp.common.ImageProperties",
            "className":"com.ptvag.mnp.common.ImageProperties"
        };
        
        imageProps.centerIcon=null;
        imageProps.defaultPois=null;
        imageProps.detailLevel=null;
        imageProps.imageProfile=null;
        imageProps.scaleUnit="KM";
        imageProps.showScale="false";
        imageProps._valueEnabled="true";
        imageProps._properties="enabled";
        imageProps._disposed="false";
        imageProps.deviceWidth=config.map.getWidth();
        imageProps.deviceHeight=config.map.getHeight();
        var displayProperties={
            "class":"com.ptvag.mnp.common.RouteDisplayProperties",
            "className":"com.ptvag.mnp.common.RouteDisplayProperties"
        };
        
        displayProperties.routeDisplayProfile="DarkBlue";
        imageProps.routeDisplay=displayProperties;
        if(log.isDebugEnabled()){
            log.debug("station list:      ",JSON.stringify(stationList));
            log.debug("routeResultOptions:",JSON.stringify(routeResultOptions));
            log.debug("routeOptions:      ",JSON.stringify(routeOptions));
            log.debug("imageProps:        ",JSON.stringify(imageProps));
        }
        ptvRouteService.getMapByStations(stationList,routeResultOptions,routeOptions,null,imageProps,"Europe",null,onGetRouteCallback);
    };
    
    var onGetRouteCallback=function(pRes,pException){
        log.trace("onGetRouteCallback()");
        if(pException!=null){
            log.error("PTV exception:",JSON.stringify(pException));
            return;
        }
        log.debug("save route result");
        lastMappingResult=pRes.mappingResult;
        if(lastMappingResult==null){
            log.error("lastMappingResult is null");
        }
        log.debug("call displayRouteList()");
        try{
            displayRouteList(pRes);
        }catch(e){
            log.error(e);
        }
    };
    
var displayRouteList=function(pRes){
    log.trace("displayRouteList()");
    var routingResult=pRes.routingResults[0];
    var stationlist=addressList;
    var sections=routingResult.sections;
    var routeDistance=routingResult.distance;
    var routeTime=routingResult.time;
    var miniMapConfigs=new Array();
    log.trace("add header html");
    var printHTML="<b>"+config.txtDistance+":</b> "+roundKilometers(routeDistance)+"&nbsp;km<br>";
    printHTML+="<b>"+"Zeit"+":</b> "+seconds2Time(routeTime,false)+"<br><br>";
    log.debug("add statistics");
    printHTML+='<div id="scrolllist" class="scrolllist">';
    printHTML+='<table border="1" cellpadding="2" class="routelisttable">';
    printHTML+='<colgroup>';
    printHTML+='  <col width="28">';
    printHTML+='  <col width="57">';
    printHTML+='  <col width="72">';
    printHTML+='  <col width="280">';
    printHTML+='  <col width="165">';
    printHTML+='</colgroup>';
    printHTML+='<tr class="routelistheader">';
    printHTML+='<th>&nbsp;</th>';
    printHTML+='<th align="center">'+config.txtDuration+'</th>';
    printHTML+='<th align="center">'+config.txtDistance+'</th>';
    printHTML+='<th align="center">'+config.txtInstruction+'</th>';
    printHTML+='<th align="center">'+config.txtDirection+'</th>';
    printHTML+='</tr>';
    var nodeCssClass="";
    var duration=0;
    var nodeCount=0;
    var counterStartViaEnd=0;
    log.debug("add sections. Amount:",sections.length);
    for(i=0;i<sections.length;i++){
        log.trace("handle section",i);
        var routeElement=sections[i];
        if(i%2==0){
            nodeCssClass="routelisteven";
        }else{
            nodeCssClass="routelistodd";
        }
        duration=duration+routeElement.diffTime;
        var nodePrio=routeElement.type;
        var nodeTurn=routeElement.turn;
        var streetType=routeElement.streetType;
        if(i<sections.length-1){
            nextRouteElement=sections[i+1];
            nextStreetType=nextRouteElement.streetType;
        }else{
            nextRouteElement=sections[i];
            nextStreetType=nextRouteElement.streetType;
        }
        switch(nodeTurn){
            case"ROUNDABOUT_EXIT":
                dirImg="arrow_roundabout";
                break;
            case"STRAIGHT_ON":
                dirImg="arrow_N";
                break;
            case"2":
                dirImg="arrow_SO";
                break;
            case"TURN_HALF_LEFT":
                dirImg="arrow_NW";
                break;
            case"TURN_LEFT":
                dirImg="arrow_W";
                break;
            case"5":
                dirImg="arrow_SW";
                break;
            case"TURN_HALF_RIGHT":
                dirImg="arrow_NO";
                break;
            case"TURN_RIGHT":
                dirImg="arrow_O";
                break;
            case"8":
                dirImg="arrow_S";
                break;
            default:
                dirImg="";
                break;
        }
        var dirInmagePrefix="http://80.146.239.135/ptvrouting/images/"+dirImg+".gif";
        var directionIMG='<img style="align:left;" src="'+dirInmagePrefix+'">';
        var myTextInfo=routeElement.textInfo.replace(/\//g,"/<wbr />");
        var nodeDescription="";
        log.trace("nodePrio:",nodePrio);
        if(nodePrio!="INFO"){
            if(nodePrio=="START"||nodePrio=="VIA"||nodePrio=="END"){
                log.trace("handle section: ",nodePrio);
                var station=stationlist[counterStartViaEnd];
                counterStartViaEnd++;
                var plz=station.zipcode||"";
                var city=station.city||"";
                var cityDistrict=station.cityDistrict||"";
                var street=station.street||"";
                nodeDescription="<b>"+plz+"&nbsp;"+city+"&nbsp;"+cityDistrict+"&nbsp;"+street+"</b>";
                log.trace("nodeDescription:",nodeDescription);
            }else{
                log.info("No INFO/START/END section. NodePrio:",nodePrio);
                nodeDescription="<b>"+nodePrio+"&nbsp;</b>";
            }
        }else{
        nodeDescription=myTextInfo;
    }
    printHTML+='<tr class="'+nodeCssClass+'" id="routlistrow"'+i+'">';
    printHTML+='<td valign="top" align="right">'+(i+1)+'&nbsp;</td>';
        printHTML+='<td valign="top" align="right">'+seconds2Time(duration,false)+'</td>';
        printHTML+='<td valign="top" align="right">'+roundKilometers(routeElement.distance)+'&nbsp;km</td>';
        printHTML+='<td valign="top">'+directionIMG+'&nbsp;'+nodeDescription+'&nbsp;</td>';
        mySign=routeElement.sign.replace(/\//g,"/<wbr />");
        myDirection=routeElement.direction.replace(/\//g,"/<wbr />");
        if(mySign!=""){
        if(streetType=="MOTORWAY"||nextStreetType=="MOTORWAY"){
            printHTML+='<td valign="top"><div class="routelistdirection1">'+mySign+'</div>&nbsp;</td>';
        }
        else if(streetType=="HIGHWAY"||streetType=="TRUNKROAD"||streetType=="COUNTRYROAD"||streetType=="CITYROAD"||streetType=="RESIDENTIALROAD"){
            printHTML+='<td valign="top"><div class="routelistdirection2">'+mySign+'</div>&nbsp;</td>';
        }else{
            printHTML+='<td valign="top"><div class="routelistdirection">'+mySign+'</div>&nbsp;</td>';
        }
    }else if(myDirection!=""){
        if(streetType=="MOTORWAY"||nextStreetType=="MOTORWAY"){
            printHTML+='<td valign="top"><div class="routelistdirection1">'+myDirection+'</div>&nbsp;</td>';
        }
        else if(streetType=="HIGHWAY"||streetType=="TRUNKROAD"||streetType=="COUNTRYROAD"||streetType=="CITYROAD"||streetType=="RESIDENTIALROAD"){
            printHTML+='<td valign="top"><div class="routelistdirection2">'+myDirection+'</div>&nbsp;</td>';
        }else{
            printHTML+='<td valign="top"><div class="routelistdirection">'+myDirection+'</div>&nbsp;</td>';
        }
    }else{
    printHTML+='<td>&nbsp;</td>';
}
printHTML+='</tr>';
}
printHTML+='</table>';
printHTML+='</div>';
$("#routeResultListPrint").html(printHTML);
log.info("next step: create all PtvMiniMaps");
};

var clickRow=function(domid,x,y){
    markBackground(domid);
    i=domid.replace("routlistrow","");
    moveMap(x,y);
    myShowHideCircle(x,y,i,"show");
};

var findPoint=function(pSectionIndex,pPoints,pPoint){
    var maxDif=10;
    for(var pl=0;pl<=pPoints.length-2;pl=pl+2){
        var difX=pPoints[pl]-pPoint.x;
        var difY=pPoints[pl+1]-pPoint.y;
        if(difX<0){
            difX=difX*-1;
        }
        if(difY<0){
            difY=difY*-1;
        }
        if(difX<=maxDif&&difY<=maxDif){
            log.debug("Gefunden fuer section:"+pSectionIndex+" bei index:"+pl);
            return pl;
        }
    }
    }
this.removeRouteFromMap=function(){
    log.trace("removeRouteFromMap()");
    if(lastMappingResult!=null){
        if(lastMappingResult.length==undefined){
            lastMappingResult.service.hideSMO(lastMappingResult);
        }
        else{
            for(i=0;i<lastMappingResult.length;i++){
                lastMappingResult[i].service.hideSMO(lastMappingResult[i]);
            }
            }
    lastMappingResult=null;
    log.debug("route deleted");
    $("#routeResultListPrint").html("");
    log.debug("route result list deleted");
    miniMapList=new Array();
}else{
    log.debug("no route to remove");
}
};

this.printMode=function(){
    $.each(miniMapList,function(pIndex,pMiniMap){
        var t=setTimeout(function(){
            pMiniMap.printMode();
        },1500*pIndex);
    });
};

}
de.allianz.ifa.PtvMiniMap=function(pConfig){
    var log=log4javascript.getLogger("de.allianz.ifa.agentursuche.PtvMiniMap");
    log.debug("create PtvMiniMap");
    var config={};
    
    $.extend(config,pConfig||{});
    if(log.isDebugEnabled()){
        log.debug("Config",JSON.stringify(config));
    }
    var ptvMapUtil;
    var map;
    var init=function(){
        ptvMapUtil=new de.allianz.ifa.agentursuche.PtvMapUtil({
            mapId:config.mapId
            });
        map=new com.ptvag.webcomponent.map.Map(document.getElementById(config.mapId));
        map.setBackendServer("Europe");
        drawMap();
        drawRoute();
    };
    
    var drawMap=function(){
        map.getLayer("zoomslider").setEnabled(false);
        map.getLayer("toolbar").setEnabled(false);
        map.getLayer("copyright").setEnabled(false);
        map.getLayer("scale").setEnabled(false);
        var pointSu=ptvMapUtil.convertPoiToSuCoordinates({
            lon:config.point.x,
            lat:config.point.y
            });
        map.setZoom(4);
        map.setViewToPoints([pointSu],false,true);
    };
    
    var drawRoute=function(){
        var route=new com.ptvag.webcomponent.map.vector.Line();
        route.setColor("rgba(10,10,255,0.5)");
        route.setPixelSize(10);
        route.setCoordinates(config.route);
        route.setId(config.mapId+"_route");
        map.getLayer("vector").addElement(route);
    };
    
    this.printMode=function(){
        log.time(config.mapId);
        map.printMode();
        log.timeEnd(config.mapId);
    };
    
    init();
};

function formatTimePart(input){
    return(input<10)?"0"+input:input;
}
function seconds2Time(seconds,showSeconds){
    var mySeconds=seconds%60;
    var myMinutes=Math.floor(seconds/60)%60;
    var myHours=Math.floor(seconds/3600);
    if(!showSeconds||myHours>0){
        if(mySeconds>30){
            myMinutes++;
        }
        if(myMinutes>=60){
            myMinutes=0;
            myHours++;
        }
        return""+myHours+"."+formatTimePart(myMinutes)+"&nbsp;h";
    }else{
        return""+myMinutes+"."+formatTimePart(mySeconds)+"&nbsp;min";
    }
}
function roundKilometers(distance){
    distance/=100;
    distance=Math.round(distance);
    distance/=10;
    return distance;
}
function highlightBackground(domid){
    if(domid!=myRouting.markedNode){
        $(domid).className="routelisthighlight";
    }
}
function resetBackground(domid){
    if(domid==myRouting.markedNode){
        $(domid).className="routelistmark";
    }else if(parseInt(domid.replace("routlistrow",""))%2==0){
        $(domid).className="routelisteven";
    }else{
        $(domid).className="routelistodd";
    }
}
function markBackground(domid){
    if(myRouting.markedNode!=""){
        if(parseInt(myRouting.markedNode.replace("routlistrow",""))%2==0){
            $(myRouting.markedNode).className="routelisteven";
        }else{
            $(myRouting.markedNode).className="routelistodd";
        }
    }
$(domid).className="routelistmark";
myRouting.markedNode=domid;
}
if(!window.de.allianz.ifa.agentursuche)de.allianz.ifa.agentursuche={};
    
de.allianz.ifa.agentursuche.BusinesscardCreater=function(pConfig){
    var self=this;
    var log=log4javascript.getLogger("de.allianz.ifa.agentursuche.BusinesscardCreater");
    log.debug("Erstelle Instanz");
    var config=pConfig||{};
    
    this.getBusinesscardHtml=function(pPoi){
        log.trace("getBusinesscardHtml() for "+pPoi.id);
        if(pPoi.poiCategory=='AGENCY'){
            return createAgencyBusinesscard(pPoi);
        }else if(pPoi.poiCategory=='CASHPOINT'){
            return createCashpointBusinesscard(pPoi);
        }else if(pPoi.poiCategory=='FAIRPLAY_GARAGE'){
            return createPartnerBusinesscard(pPoi);
        }else if(pPoi.poiCategory=='PARTNER'){
            return createPartnerBusinesscard(pPoi);
        }else{
            log.warn("No special businesscard implemented.")
            }
        return createDefaultBusinesscard(pPoi);
    };
    
    var createAgencyBusinesscard=function(pAgency){
        log.trace("createAgencyBusinesscard() for "+pAgency.id);
        var businesscardHtml='';
        businesscardHtml+='<div class="businesscardAgency">';
        businesscardHtml+=' <div class="businesscardAgencyImage">';
        if(pAgency.emailPrefix){
            businesscardHtml+='  <img src="'+config.agencyImageUrlPrefix+pAgency.imageRefId+'">';
        }else{
            businesscardHtml+='  <img src="'+config.agencyImageDefault+'">';
        }
        businesscardHtml+=' </div>';
        businesscardHtml+='<b>'+pAgency.name+'</b><br>';
        businesscardHtml+=printIfAvaiable(pAgency.agencyTitle,'<b>','</b><br>');
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pAgency.street,null,'<br>');
        businesscardHtml+=printIfAvaiable(pAgency.postalCode+" "+pAgency.city,null,'<br>');
        businesscardHtml+=printIfAvaiable(pAgency.distance,'Entfernung: ',' km<br>');
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pAgency.phoneNumber,'Telefon: ','<br>');
        businesscardHtml+=printIfAvaiable(pAgency.telefaxNumber,'Telefax: ','<br>');
        businesscardHtml+='<br>';
        if(pAgency.businessHours!=null){
            businesscardHtml+='&Ouml;ffnungszeiten:<br>';
            for(var i=0;i<pAgency.businessHours.length;i++){
                businesscardHtml+=pAgency.businessHours[i]+'<br>';
            }
            businesscardHtml+='<br>';
        }
        businesscardHtml+='<table width="100%"';
        businesscardHtml+='<tr>';
        businesscardHtml+=printIfAvaiable(pAgency.emailPrefix,'<td><a class="agsLink" href="'+config.homepageUrlPrefix,'/index.html" target="_self"><span class=" inlinetext">Homepage</span></a></td>');
        businesscardHtml+=printIfAvaiable(pAgency.emailPrefix,'<td><a class="agsLink" href="'+config.homepageUrlPrefix,'/kundenservice/kontaktdialog.html" target="_self"><span class=" inlinetext">Kontakt</span></a></td>');
        if(config.agenturSucheMetaData.searchType=="ADDRESS"){
            businesscardHtml+=printIfAvaiable(pAgency.id,'<td><a class="agsLink" href="#" onClick="agsGlobal.routeToPoi( \'','\' ); return false;"><span class=" inlinetext">Anfahrt</span></a></td>');
        }
        businesscardHtml+='</tr>';
        businesscardHtml+='</table>';
        businesscardHtml+='<br>';
        if(pAgency.otherLocationsAvailable===true){
            businesscardHtml+='<a class="agsLink" href="#" onClick="agsGlobal.searchLocations( \''+pAgency.id+'\' ); return false;"><span class=" inlinetext">Alle Standorte</span></a>';
        }
        businesscardHtml+='</div>';
        return businesscardHtml;
    };
    
    var createCashpointBusinesscard=function(pPoi){
        log.trace("createCashpointBusinesscard() for "+pPoi.id);
        var businesscardHtml='';
        businesscardHtml+='<div class="businesscardPoi">';
        businesscardHtml+='<div style="display:inline-block;">';
        if(pPoi.poiProperties.azbFree==='true'){
            var iconUrl=config.urlPathPrefix+config.urlPathStatic;
            iconUrl+='azbFreeTrue.gif';
            businesscardHtml+='<img src="'+iconUrl+'" />';
        }else{
            var iconUrl=config.urlPathPrefix+config.urlPathStatic;
            iconUrl+='azbFreeFalse.gif';
            businesscardHtml+='<img src="'+iconUrl+'" />';
        }
        businesscardHtml+='</div>';
        businesscardHtml+='<br>';
        businesscardHtml+='<b>'+pPoi.poiProperties.NAME2+'</b><br>';
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.street+' '+pPoi.streetNumber,null,'<br>');
        businesscardHtml+=pPoi.postalCode+' '+pPoi.city+'<br>';
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.poiProperties.BHS1,'Öffnungszeiten:<br>','<br>');
        businesscardHtml+='<br>';
        if(config.agenturSucheMetaData.searchType=='ADDRESS'){
            businesscardHtml+='Entfernung: '+pPoi.distance+' km<br>';
        }
        businesscardHtml+='<br>';
        if(config.agenturSucheMetaData.searchType=="ADDRESS"){
            businesscardHtml+='<a class="agsLink" href="#" onClick="agsGlobal.routeToPoi( \''+pPoi.id+'\' ); return false;"><span class=" inlinetext">Anfahrt berechnen</span></a>';
        }
        businesscardHtml+='<br>';
        businesscardHtml+='</div>';
        return businesscardHtml;
    };
    
    var createFairplayGarageBusinesscard=function(pPoi){
        log.trace("createFairplayGarageBusinesscard() for "+pPoi.id);
        var businesscardHtml='';
        businesscardHtml+='<div class="businesscardPoi">';
        businesscardHtml+='<b>'+pPoi.name+'</b><br>';
        businesscardHtml+=pPoi.poiProperties.Partner+'<br>';
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.street,null,'<br>');
        businesscardHtml+=pPoi.postalCode+' '+pPoi.city+'<br>';
        businesscardHtml+='<br>';
        businesscardHtml+='Telefon: '+pPoi.poiProperties.Phone+'<br>';
        businesscardHtml+='<br>';
        if(config.agenturSucheMetaData.searchType=='ADDRESS'){
            businesscardHtml+='Entfernung: '+pPoi.distance+' km<br>';
        }
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.homepageUrl,'<a class="agsLink" href="','" target="_blank"><span class=" inlinetext">Homepage</span></a>');
        if(config.agenturSucheMetaData.searchType=="ADDRESS"){
            businesscardHtml+='<a class="agsLink" href="#" onClick="agsGlobal.routeToPoi( \''+pPoi.id+'\' ); return false;"><span class=" inlinetext">Anfahrt berechnen</span></a>';
        }
        businesscardHtml+='<br>';
        businesscardHtml+='</div>';
        return businesscardHtml;
    };
    
    var createPartnerBusinesscard=function(pPoi){
        log.trace("createPartnerBusinesscard() for "+pPoi.id);
        var businesscardHtml='';
        businesscardHtml+='<div class="businesscardPoi">';
        var type=pPoi.poiProperties.PartnerTypeId;
        if(type=='14'||type=='15'||type=='20'||type=='50'||type=='51'||type=='52'||type=='53'||type=='54'||type=='55'||type=='56'||type=='57'||type=='58'||type=='59'||type=='60'){
            businesscardHtml+=' <div class="businesscardAgencyImage">';
            businesscardHtml+='  <img src="'+config.urlPathPrefix+config.urlPathStatic+'ags/partner/'+pPoi.poiProperties.PartnerTypeId+'.jpg">';
            businesscardHtml+=' </div>';
        }
        businesscardHtml+='<b>'+pPoi.poiProperties.PartnerTypeName+'</b><br>';
        if(pPoi.name!='.'){
            businesscardHtml+=pPoi.name+'<br>'
            }
        businesscardHtml+=''
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.street,null,'<br>');
        businesscardHtml+=pPoi.postalCode+' '+pPoi.city+'<br>';
        if(config.agenturSucheMetaData.searchType=='ADDRESS'){
            businesscardHtml+='Entfernung: '+pPoi.distance+' km<br>';
        }
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.poiProperties.Phone,'Telefon: ','<br>');
        businesscardHtml+='<br>';
        if(pPoi.poiProperties.Serviceleistung1||pPoi.poiProperties.Serviceleistung2||pPoi.poiProperties.Serviceleistung3){
            businesscardHtml+='Serviceleistungen:<br>';
            businesscardHtml+=printIfAvaiable(pPoi.poiProperties.Serviceleistung1,null,'<br>');
            businesscardHtml+=printIfAvaiable(pPoi.poiProperties.Serviceleistung2,null,'<br>');
            businesscardHtml+=printIfAvaiable(pPoi.poiProperties.Serviceleistung3,null,'<br>');
        }
        businesscardHtml+='<br>';
        businesscardHtml+='<table width="100%"';
        businesscardHtml+='<tr>';
        if(config.agenturSucheMetaData.searchType=="ADDRESS"){
            businesscardHtml+='<td><a class="agsLink" href="#" onClick="agsGlobal.routeToPoi( \''+pPoi.id+'\' ); return false;"><span class=" inlinetext">Anfahrt berechnen</span></a></td>';
        }
        businesscardHtml+=printIfAvaiable(pPoi.poiProperties.Internetseite,'<td><a class="agsLink" href="','" target="_blank"><span class=" inlinetext">Homepage</span></a></td>');
        businesscardHtml+='</tr>';
        businesscardHtml+='</table>';
        businesscardHtml+='<br>';
        businesscardHtml+='</div>';
        return businesscardHtml;
    };
    
    var createDefaultBusinesscard=function(pPoi){
        log.trace("createDefaultBusinesscard() for "+pPoi.id);
        var businesscardHtml='';
        businesscardHtml+='<div class="businesscardPoi">';
        businesscardHtml+='<b>'+pPoi.name+'</b><br>';
        businesscardHtml+='<br>';
        businesscardHtml+=printIfAvaiable(pPoi.street,null,'<br>');
        businesscardHtml+=pPoi.postalCode+' '+pPoi.city+'<br>';
        businesscardHtml+='<br>';
        if(config.agenturSucheMetaData.searchType=='ADDRESS'){
            businesscardHtml+='Entfernung: '+pPoi.distance+' km<br>';
        }
        businesscardHtml+='<br>';
        if(config.agenturSucheMetaData.searchType=="ADDRESS"){
            businesscardHtml+='<a class="agsLink" href="#" onClick="agsGlobal.routeToPoi( \''+pPoi.id+'\' ); return false;"><span class=" inlinetext">Anfahrt berechnen</span></a>';
        }
        businesscardHtml+='<br>';
        businesscardHtml+='</div>';
        return businesscardHtml;
    };
    
    var printIfAvaiable=function(pValue,pPrefix,pPostfix){
        log.trace("printIfAvaiable()");
        var resultString="";
        var valueAvailable=true;
        var value=pValue;
        if(!value){
            valueAvailable=false;
        }
        else if(typeof pValue=="string"){
            value=value.replace(/null/g,"");
            if($.trim(value).length==0){
                valueAvailable=false;
            }
        }
    if(valueAvailable===true){
        if(pPrefix!=null){
            log.trace("prefix:",pPrefix);
            resultString=pPrefix;
        }
        resultString+=value;
        if(pPostfix!=null){
            log.trace("postfix:",pPostfix);
            resultString+=pPostfix;
        }
    }
log.trace("printIfAvaiable:",resultString);
    return resultString;
};

};

function transformToGpx(pNumber){
    if(pNumber>10000000){
        return pNumber/1000000;
    }
    if(pNumber>1000000){
        return pNumber/100000;
    }
    if(pNumber>100000){
        return pNumber/10000;
    }
    if(pNumber>10000){
        return pNumber/1000;
    }
    if(pNumber>1000){
        return pNumber/100;
    }
}
function createOsmLink(pLon,pLat){
    var url="http://www.openstreetmap.org/?";
    url+="mlat="+transformToGpx(pLat);
    url+="&mlon="+transformToGpx(pLon);
    url+="&zoom=18&layers=B000FTF";
    var html='<a href="'+url+'">OSM</a>';
    return html;
}
function addMarkerBlue(pX,pY){
    addMarker(pX,pY,"http://www.htsv.de/vereine2osm/include/marker-blue.png");
}
function addMarker(pX,pY,pMarker){
    var log=log4javascript.getLogger("globaler Logger");
    log.trace("addMarker",pX,pY);
    var util=new de.allianz.ifa.agentursuche.PtvMapUtil({
        mapId:"ID"
    });
    var pPoi={};
    
    var pointSu=util.convertPoiToSuCoordinates({
        lon:pX,
        lat:pY
    });
    pPoi.suX=pointSu.x;
    pPoi.suY=pointSu.y;
    var url="http://www.openstreetmap.org/openlayers/img/marker.png";
    if(pMarker!=null){
        url=pMarker;
    }
    var image=new com.ptvag.webcomponent.map.vector.ImageMarker(pPoi.suX,pPoi.suY,url,null,null,"idImage_"+getRandom(0,10000),false);
    map.getLayer("vector").addElement(image);
}
function getRandom(min,max){
    if(min>max){
        return(-1);
    }
    if(min==max){
        return(min);
    }
    return(min+parseInt(Math.random()*(max-min+1)));
}