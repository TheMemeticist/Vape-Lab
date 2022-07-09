
let crBox = {
  'Model':'Corsi-Rosenthal Box',
  'Watts':[67, 31],
  'Life':0.5,
  'Price':[80, 40],
  'Size':1.666667,
  'CADR':[320, 580 - 320],
  'Stack':true,
  'Source':'https://www.tandfonline.com/doi/full/10.1080/02786826.2022.2054674',
};
let crBoxHE = {
  'Model':'CR-Box [High Flow]',
  'Watts':[67, 31],
  'Life':0.5,
  'Price':[90, 40],
  'Size':1.666667,
  'CADR':[600, 252],
  'Stack':true,
  'Source':'https://www.tandfonline.com/doi/full/10.1080/02786826.2022.2054674',
};
let miniCRBox = {
  'Model':'CR-Box [Mini]',
  'Watts':[67/4, 31],
  'Life':0.5,
  'Price':[70/4, 40],
  'Size':1.666667/4,
  'CADR':[320/4, (580 - 320)/4],
  'Stack':true,
  'Source':'https://www.texairfilters.com/a-mini-corsi-rosenthal-box-air-cleaner/',
};
let medify = {
  'Model':'Medify Air MA-112 Air Purifier',
  'Watts':[15, 85],
  'Life':1,
  'Price':[630, 60],
  'Size':2,
  'CADR':[950, 100],
  'Stack':false,
  'Source':'https://airfuji.com/best-high-cadr-air-purifier/',
};

let catalogue = [
  crBox,
  crBoxHE,
  miniCRBox,
  medify,
];
export {catalogue};
