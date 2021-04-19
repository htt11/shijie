import Vue from 'vue'

let date = function (value) {
  if (!value) {
    return '---'
  }
  let time = new Date(value)
  let year = time.getFullYear() + ''
  let month = (time.getMonth() + 1) + ''
  month = (month.length === 1 ? '0' + month : month)
  let day = time.getDate() + ''
  day = (day.length === 1 ? '0' + day : day)
  let hour = time.getHours() + ''
  hour = (hour.length === 1 ? '0' + hour : hour)
  let minute = time.getMinutes() + ''
  minute = (minute.length === 1 ? '0' + minute : minute)
  let second = time.getSeconds() + ''
  second = (second.length === 1 ? '0' + second : second)
  return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
}

export default function () {
  Vue.filter('date', date)
}
