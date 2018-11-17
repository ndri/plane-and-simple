# plane-and-simple
Computer Graphics 2018 Project - Plane and Simple

Projects page: https://courses.cs.ut.ee/2018/cg/fall/Main/Projects

Wiki page: https://courses.cs.ut.ee/2018/cg/fall/Main/Project-PlaneGame

Latest version: https://andri.io/plane-and-simple

Team members:

* Andri Soone [@ndri](https://github.com/ndri)
* Jorgen Juurik [@jorgen5](https://github.com/jorgen5)
* Erik Martin Vetemaa [@lehmaudar](https://github.com/lehmaudar)

# About
Plane and Simple is a simple 3D browser game where you can fly a plane. 

# First Deadline
For the first deadline we decided to make a simple base game that we could upgrade over the course of the semester. The base consists of a simple plane model, environment, some basic controls for movement and physics for gravity and collisions.

## The Model
A very simple plane model was created.

## Environment
The base environment of the game was created. The evironment consists of a simple level with trees and clouds for decoration. The decorative objects are generated randomly during the initialization of each game.

## Controls
Also, controls were added. For moving the plane. The arrow keys are assigned to change the pitch and roll of the plane while Q and E are there to adjust the yaw. For acceleration and deceleration the player can use W and S respectively.

## Physics
For the first deadline simple but much needed physics were added to the game. Physics that alter the speed of the plane depending which direction it is flying make the flying more natural and give the plane some weight. Using the collision detection the plane can collide with different objects. However, a more complex collision detection method might have to be implemented in the future to fix some recurring errors with model clipping.

## The Goal of the Game
To make the game more challenging, rings were added. The rings can be flown through with the plane. In the future a score might be added.
