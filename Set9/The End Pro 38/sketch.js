var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart,cloudPos,obstaclePos;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadImage("images/player.png");
  trex_collided = loadAnimation("images/cry.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/r1.jpg");
  obstacle2 = loadImage("images/r2.jpg");
  obstacle3 = loadImage("images/obstacle6.png");
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth/2, displayHeight/2);
  
  trex = createSprite(100,displayHeight/2-100,20,50);
  
  trex.addImage("running", trex_running);
  trex.addImage("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX=2;
  
  ground = createSprite(-50,displayHeight/2-50,displayWidth/2,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/4,displayHeight/4-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/4,displayHeight/4);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight/2-40,displayWidth*3,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  cloudPos=displayWidth/2;
  obstaclePos=displayWidth/2;

  console.log(displayWidth);
}

function draw() {
  //trex.debug = true;
  background(200);
  text("Score: "+ score, camera.x+200,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
   camera.x=trex.x+250;
   camera.y=displayHeight/4;

    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
    if(trex.x===displayWidth){
      trex.x=100;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    gameOver.x=camera.x;
    restart.x=camera.x;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityX=0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeImage("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloudPos += 160;
    var cloud = createSprite(cloudPos,120,40,10);
   // cloud.x += 60;
    cloud.y = Math.round(random(80,displayHeight/4));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 2000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    obstaclePos += 300
    var obstacle = createSprite(obstaclePos,displayHeight/2-70,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    obstacle.x += 60;

    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 2000;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.x=100;
  trex.velocityX=2;

  //obstaclesGroup.destroyEach();
  //cloudsGroup.destroyEach();
  
  trex.changeImage("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
