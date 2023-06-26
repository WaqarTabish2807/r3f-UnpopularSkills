# R3F Website for Unpopular Skills

## The idea

Let’s create a website to showcase my unique skills, apart from sitting in front of a laptop. I wanna make a 3d website with scroll animations. I’m currently exploring React, so let’s use React-Three-Fiber.

I need some ideas now as I’ve set the project's base. After countless hours of research, I came across the website by Atmos. Short, highly defined, and a perfect fit for my requirement. When I started creating components and architecture, I got a broader idea of what it would look like. The next target was to find airplane and cloud models for my project. The real problem started hitting. I could not get free Webgl models as per my requirement, and I had no time to learn and create it through Blender (and my laptop sucks too).

Then I came across an absolute goldmine [Polypizza](https://poly.pizza/) (Every low poly model you could ever need). Stuffed my items. Started with development. Got stuck for many hours on smoothening the transition and slowing the speed at specific points. You can check what I made here [Live](https://unpopular-skills.netlify.app/)

## Features

### Scroll animation

The scroll animation is the main feature of the website. It needs to work on all devices. Fortunately, React-three/drei has a built-in function to do that. Set up all the scroll-animated components inside a ScrollControls component from drei. All the children can access the useScroll hook. There is a lot of data inside, but I need to use the offset to get the scroll progress from 0 to 1. This state will help me display the right content.

### Mount & Unmount animations

The rendering works fine, and I can see the message that I want when I want (cf the scroll animation feature). The thing is, I’d like to add a fade animation when a message appears. It’s effortless to do in native Javascript, but with React, I can’t add an animation or transition when the component unmounts. After looking for some libraries, I picked react-spring. It’s the smallest one I could find, and I don’t want to add a big lib for such a simple thing. It’s hard to set up because the documentation and the examples show different implementations. I’ve wasted more time than I wanted, but hey, it works.

Created with the help of [this starter](https://github.com/wass08/r3f-wawatmos-starter).

Inspired by [Atmos](https://atmos.leeroy.ca/).

## 3D Model credits

Airplane by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](<https://poly.pizza/m/8VysVKMXN2J>)
