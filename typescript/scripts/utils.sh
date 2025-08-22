#!/bin/bash

C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_BLUE='\033[0;34m'
C_YELLOW='\033[1;33m'
C_ORANGE='\033[0;33m'
C_CYAN='\033[0;36m'
C_PURPLE='\033[0;35m'
C_LIGHT_GRAY='\033[0;37m'
C_DARK_GRAY='\033[1;30m'
C_LIGHT_RED='\033[1;31m'
C_LIGHT_GREEN='\033[1;32m'
C_LIGHT_BLUE='\033[1;34m'
C_LIGHT_PURPLE='\033[1;35m'
C_LIGHT_CYAN='\033[1;36m'

# println echos string
function println() {
  echo -e "$1"
}

# errorln echos i red color
function errorln() {
  println "${C_LIGHT_RED}${1}${C_RESET}${@:2}"
}

# successln echos in green color
function successln() {
  println "${C_LIGHT_GREEN}${1}${C_RESET}${@:2}"
}

# infoln echos in blue color
function infoln() {
  println "${C_LIGHT_BLUE}${1}${C_RESET}${@:2}"
}

# warnln echos in yellow color
function warnln() {
  println "${C_YELLOW}${1}${C_RESET}${@:2}"
}

# fatalln echos in red color and exits with fail status
function fatalln() {
  errorln "$1"
  exit 1
}

# Other colors
function orangeln() {
  println "${C_ORANGE}${1}${C_RESET}${@:2}"
}

function cyanln() {
  println "${C_CYAN}${1}${C_RESET}${@:2}"
}

function purpleln() {
  println "${C_PURPLE}${1}${C_RESET}${@:2}"
}

function lightGrayln() {
  println "${C_LIGHT_GRAY}${1}${C_RESET}${@:2}"
}

function darkGrayln() {
  println "${C_DARK_GRAY}${1}${C_RESET}${@:2}"
}

function lightRedln() {
  println "${C_LIGHT_RED}${1}${C_RESET}${@:2}"
}

function lightGreenln() {
  println "${C_LIGHT_GREEN}${1}${C_RESET}${@:2}"
}

function lightBlueln() {
  println "${C_LIGHT_BLUE}${1}${C_RESET}${@:2}"
}

function lightPurpleln() {
  println "${C_LIGHT_PURPLE}${1}${C_RESET}${@:2}"
}

function lightCyanln() {
  println "${C_LIGHT_CYAN}${1}${C_RESET}${@:2}"
}

# Define log function
function logError() {
  errorln "[ERROR] " "$@"
}

function logInfo() {
  infoln "[INFO] " "$@"
}

function logWarn() {
  warnln "[WARN] " "$@"
}

function checkCWDToRunScript() {
  if [ ! $1 == $2 ]
  then
    logError "You should run this script inside [$1]. Currently run on [$2]".
    exit 1
  fi
}

export -f errorln
export -f successln
export -f infoln
export -f warnln
export -f orangeln
export -f cyanln
export -f purpleln
export -f lightGrayln
export -f darkGrayln
export -f lightRedln
export -f lightGreenln
export -f lightBlueln
export -f lightPurpleln
export -f lightCyanln
export -f logError
export -f logInfo
export -f logWarn
export -f checkCWDToRunScript
