$(function(){
  // update button
  $("button").click(function (e) {
    e.preventDefault()
    ball.vy = Number($("#velocity").val())
    ball.vx = Number($("#velocity").val())
  }) 
})
