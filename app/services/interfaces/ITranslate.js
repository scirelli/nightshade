/** **************************************************************************
 * Translation Interface used to translate some service into the NightShate
 * schema.
 *  **************************************************************************/

if( ns instanceof Object === false ){ var ns = {}; }

!function(ns){
    'use strict';

    ns.ITranslation = function(){};

    ns.ITranslation.prototype = {
        getArtsAndCulture:function(){},
        getCareerAndBusiness:function(){},
        getCarsAndMotorcycles:function(){},
        getCommunityAndEnvironment:function(){},
        getDancing:function(){},
        getEducationAndLearning:function(){},
        getFashionAndBeauty:function(){},
        getFitness:function(){},
        getFoodAndDrink:function(){},
        getGames:function(){},
        getMovementsAndPolitics:function(){},
        getHealthAndWellbeing:function(){},
        getHobbiesAndCrafts:function(){},
        getLanguageAndEthnic:function(){},
        getIdentity:function(){},
        getLGBTeqAngel:function(){},
        getLifestyle:function(){},
        getLiteratureAndWriting:function(){},
        getMoviesAndFilm:function(){},
        getMusic:function(){},
        getNewAgeAndSpirituality:function(){}
    };


    ns.ATranslation = function(){};
    ns.ATranslation.prototype = new ns.ITranslation();

    //-- Getters --
    ns.ATranslation.prototype.getArtsAndCulture = function(){
        return this.ArtsAndCulture;
    };
    ns.ATranslation.prototype.getCareerAndBusiness = function(){
        return this.CareerAndBusiness;
    };
    ns.ATranslation.prototype.getCarsAndMotorcycles = function(){
        return this.CarsAndMotorcycles;
    };
    ns.ATranslation.prototype.getCommunityAndEnvironment = function(){
        return this.CommunityAndEnvironment;
    };
    ns.ATranslation.prototype.getDancing = function(){
        return this.Dancing;
    };
    ns.ATranslation.prototype.getEducationAndLearning = function(){
        return this.EducationAndLearning;
    };
    ns.ATranslation.prototype.getFashionAndBeauty = function(){
        return this.FashionAndBeauty;
    };
    ns.ATranslation.prototype.getFitness = function(){
        return this.Fitness;
    };
    ns.ATranslation.prototype.getFoodAndDrink = function(){
        return this.FoodAndDrink;
    };
    ns.ATranslation.prototype.getGames = function(){
        return this.Games;
    };
    ns.ATranslation.prototype.getMovementsAndPolitics = function(){
        return this.MovementsAndPolitics;
    };
    ns.ATranslation.prototype.getHealthAndWellbeing = function(){
        return this.HealthAndWellbeing;
    };
    ns.ATranslation.prototype.getHobbiesAndCrafts = function(){
        return this.HobbiesAndCrafts;
    };
    ns.ATranslation.prototype.getLanguageAndEthnic = function(){
        return this.LanguageAndEthnic;
    };
    ns.ATranslation.prototype.getIdentity = function(){
        return this.Identity;
    };
    ns.ATranslation.prototype.getLGBTeqAngel = function(){
        return this.LGBTeqAngel;
    };
    ns.ATranslation.prototype.getLifestyle = function(){
        return this.Lifestyle;
    };
    ns.ATranslation.prototype.getLiteratureAndWriting = function(){
        return this.LiteratureAndWriting;
    };
    ns.ATranslation.prototype.getMoviesAndFilm = function(){
        return this.MoviesAndFilm;
    };
    ns.ATranslation.prototype.getMusic = function(){
        return this.Music;
    };
    ns.ATranslation.prototype.getNewAgeAndSpirituality = function(){
        return this.NewAgeAndSpirituality;
    };
    //-- Setters --
    ns.ATranslation.prototype.setArtsAndCulture = function( ArtsAndCulture ){
        this.ArtsAndCulture = ArtsAndCulture;
    };
    ns.ATranslation.prototype.setCareerAndBusiness = function( CareerAndBusiness ){
        this.CareerAndBusiness = CareerAndBusiness;
    };
    ns.ATranslation.prototype.setCarsAndMotorcycles = function( CarsAndMotorcycles ){
        this.CarsAndMotorcycles = CarsAndMotorcycles;
    };
    ns.ATranslation.prototype.setCommunityAndEnvironment = function( CommunityAndEnvironment ){
        this.CommunityAndEnvironment = CommunityAndEnvironment;
    };
    ns.ATranslation.prototype.setDancing = function( Dancing ){
        this.Dancing = Dancing;
    };
    ns.ATranslation.prototype.setEducationAndLearning = function( EducationAndLearning ){
        this.EducationAndLearning = EducationAndLearning;
    };
    ns.ATranslation.prototype.setFashionAndBeauty = function( FashionAndBeauty ){
        this.FashionAndBeauty = FashionAndBeauty;
    };
    ns.ATranslation.prototype.setFitness = function( Fitness ){
        this.Fitness = Fitness;
    };
    ns.ATranslation.prototype.setFoodAndDrink = function( FoodAndDrink ){
        this.FoodAndDrink = FoodAndDrink;
    };
    ns.ATranslation.prototype.setGames = function( Games ){
        this.Games = Games;
    };
    ns.ATranslation.prototype.setMovementsAndPolitics = function( MovementsAndPolitics ){
        this.MovementsAndPolitics = MovementsAndPolitics;
    };
    ns.ATranslation.prototype.setHealthAndWellbeing = function( HealthAndWellbeing ){
        this.HealthAndWellbeing = HealthAndWellbeing;
    };
    ns.ATranslation.prototype.setHobbiesAndCrafts = function( HobbiesAndCrafts ){
        this.HobbiesAndCrafts = HobbiesAndCrafts;
    };
    ns.ATranslation.prototype.setLanguageAndEthnic = function( LanguageAndEthnic ){
        this.LanguageAndEthnic = LanguageAndEthnic;
    };
    ns.ATranslation.prototype.setIdentity = function( Identity ){
        this.Identity = Identity;
    };
    ns.ATranslation.prototype.setLGBTeqAngel = function( LGBTeqAngel ){
        this.LGBTeqAngel = LGBTeqAngel;
    };
    ns.ATranslation.prototype.setLifestyle = function( Lifestyle ){
        this.Lifestyle = Lifestyle;
    };
    ns.ATranslation.prototype.setLiteratureAndWriting = function( LiteratureAndWriting ){
        this.LiteratureAndWriting = LiteratureAndWriting;
    };
    ns.ATranslation.prototype.setMoviesAndFilm = function( MoviesAndFilm ){
        this.MoviesAndFilm = MoviesAndFilm;
    };
    ns.ATranslation.prototype.setMusic = function( Music ){
        this.Music = Music;
    };
    ns.ATranslation.prototype.setNewAgeAndSpirituality = function( NewAgeAndSpirituality ){
        this.NewAgeAndSpirituality = NewAgeAndSpirituality;
    };
}(ns);
