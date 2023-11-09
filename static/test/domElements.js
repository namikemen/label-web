export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const imageUpload = document.getElementById('imageUpload');
export const saveButton = document.getElementById('saveButton');
export const deleteButton = document.getElementById('deleteButton');
export let drawing = false;
export let labels = [];
export let startX, startY, endX, endY;
export let img; // declare img variable
export let selectedBox = null; // declare selectedBox variable