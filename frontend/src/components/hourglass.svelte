<div class="container flex justify-center m-3 mb-6">
  <div class="orbit-star">
    <div><div /></div>
    <div><div /></div>
  </div>
</div>

<!-- Whirl by jh3y -->

<style lang="scss">
  /**
  * orbit-star
  *
  * @author Aurélio A. Heckert - http://aurium.one
*/

  $size: 100px;
  $color: black;
  $rock: gold;

  @keyframes orbit-star {
    0% {
      transform: rotate(0deg) scale(var(--scale));
    }
    100% {
      transform: rotate(-360deg) scale(var(--scale));
    }
  }

  .orbit-star,
  .orbit-star > div {
    --scale: 1;
    height: $size;
    width: $size;
    position: relative;
    animation: linear orbit-star 7s infinite;
    &:before {
      content: '';
      display: block;
      height: $size;
      width: $size / 2;
      background: transparent;
      border-radius: $size/2 0 0 $size/2;
      border: none;
      border-bottom: $size/40 solid $color;
      border-left: $size/100 solid $color;
      border-top: 0 solid $color;
      opacity: 0.3;
    }
    &:after {
      content: '';
      position: absolute;
      display: block;
      top: $size * 0.38;
      left: $size * 0.38;
      height: $size * 0.24;
      width: $size * 0.24;
      background: salmon;
      border-radius: $size/6;
    }
  }

  .orbit-star > div:nth-child(1) {
    position: absolute;
    top: $size * 0.25;
    left: $size * 0.25;
    width: $size * 0.5;
    height: $size * 0.5;
    animation: linear orbit-star 5s infinite;
    &:before {
      height: $size * 0.5;
      width: $size * 0.25;
      border-bottom: $size/50 solid $color;
      border-left: $size/100 solid $color;
    }
    &:after {
      top: $size * 0.44;
      left: $size * 0.22;
      width: $size / 12;
      height: $size / 12;
      background: $rock;
    }
  }

  .orbit-star > div:nth-child(2) {
    --scale: 0.333;
    top: -52.5%;
    &:before {
      border-bottom: $size/16 solid $color;
      border-left: $size/60 solid $color;
    }
    &:after {
      top: $size * 0.29;
      left: $size * 0.29;
      width: $size * 0.42;
      height: $size * 0.42;
      border-radius: $size * 0.29;
      background: skyblue;
    }
    & > div {
      position: absolute;
      background: lightgray;
      width: $size / 5;
      height: $size / 5;
      bottom: -$size / 18;
      left: $size * 0.4;
      border-radius: $size/10;
    }
  }
</style>
