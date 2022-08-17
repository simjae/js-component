let libraryImg = {
  "data": [{
    "productIdx": 1,
    "productCode": "D4GDFG5G",
    "imgUrl": "/images/nav1.jpeg",
  },
  {
    "productIdx": 2,
    "productCode": "13D24DASDASD",
    "imgUrl": "/images/nav2.jpeg",
  },
  {
    "productIdx": 3,
    "productCode": "12DASD3DAS",
    "imgUrl": "/images/nav3.jpeg",
  },
  {
    "productIdx": 4,
    "productCode": "1D12D3D",
    "imgUrl": "/images/nav4.jpeg",
  },
  ]
}
let applyProductDetail = [];
let categoryId = '';
//----------------------- 라이브러리 -----------------------//
function libraryValid(data) {
  //파일인지 유효성 검사
  if (data.types.indexOf('Files') < 0)
    return false;
  //이미지인지 유효성 검사
  if (data.files[0].type.indexOf('image') < 0) {
    alert('이미지 파일만 업로드 가능합니다.');
    return false;
  }
  //파일의 개수는 1개씩만 가능하도록 유효성 검사
  if (data.files.length > 1) {
    alert('파일은 하나씩 전송이 가능합니다.');
    return false;
  }
  //파일의 사이즈는 50MB 미만
  if (data.files[0].size >= 1024 * 1024 * 50) {
    alert('50MB 이상인 파일은 업로드할 수 없습니다.');
    return false;
  }
  return true;
}
function imgClick(event){
  let imgEl = event.path[1].nextSibling;
  console.log('event.target.previousSibling',event.path[1].nextSibling)
  let productcode = imgEl.dataset.productcode;
  let url = imgEl.dataset.url;
  $('.product-wrap').css('background-image', 'url(' +url+ ')');
  event.stopPropagation()

}
function libraryLoad() {
  //1안
  let libraryImgHtml = "";
    for (var i in libraryImg.data) {
      console.log(`키 = ${i} : 값 = ${libraryImg.data[i].imgUrl}`);
    libraryImgHtml +=
      `<img class="library"draggable="true" id="${libraryImg.data[i].productCode}" data-name="ader1" data-url="${libraryImg.data[i].imgUrl}" data-productCode="${libraryImg.data[i].productCode}" data-idx="${libraryImg.data[i].productIdx}" src="${libraryImg.data[i].imgUrl}" alt="">`;
    console.log(libraryImgHtml);
    let productImgWrap = document.querySelector('.product-grid');
    productImgWrap.innerHTML = libraryImgHtml;
    }
  //2안

  // let imageArr = new Array(); 
  // for (var i in libraryImg.data) {
  //   imageArr[i] = new Image();
  //   imageArr[i].src = libraryImg.data[i].imgUrl;
  //   imageArr[i].id = libraryImg.data[i].productCode;
  //   console.log(imageArr[i]);
  //   console.log('image[i]' + imageArr[i]);

  //   let productImgWrap = document.querySelector('.product-grid');
  //   productImgWrap.appendChild(imageArr[i])
  // }

  
  //3안
  // for (var i in libraryImg.data) {
  //   console.log(`키 = ${i} : 값 = ${libraryImg.data[i].imgUrl}`);
  //   let img = document.createElement('img');        
  //   img.src = libraryImg.data[i].imgUrl;
  //   img.id = libraryImg.data[i].productCode;
  //   img.draggable = true;
  //   img.dataset.name = "ader1";
  //   img.dataset.url = libraryImg.data[i].imgUrl;
  //   img.dataset.productCode = libraryImg.data[i].productCode;
  //   img.dataset.idx = libraryImg.data[i].productIdx;
  //   img.classList.add('library');
  //   console.log('img',img);
  //   let productImgWrap = document.querySelector('.product-grid');
  //   productImgWrap.appendChild(img);
  // }
  libraryDragStart();
}

function libraryDragStart() {
  let library = document.querySelectorAll('.library');
  let productWrap = document.querySelector('.product-wrap');
  library.forEach((item) => {
    item.addEventListener('dragstart', (ev) => {
      if (ev.dataTransfer.effectAllowed === 'uninitialized') {
        ev.dataTransfer.setData('library', ev.target.id);
        ev.dataTransfer.setData('src', ev.target.src);
        let imgLibrarySrc = ev.target.src;
        let imgLibraryId = ev.target.id;
        ev.dataTransfer.effectAllowed = "copyMove";
        productWrap.dataset.productcode = imgLibraryId;
        productWrap.dataset.src = imgLibrarySrc;
      }
    });
  });
}
function libraryAddEvent() {
  let gridCard = document.querySelectorAll('.muuri-item');
  gridCard.forEach((item) => {
    item.addEventListener('dragover', libraryDragover);
    item.addEventListener('drop', libraryDrop);
    item.addEventListener('click', imgClick);
  });
}
function libraryDragover(ev) {
  ev.preventDefault();
  // Set the dropEffect to move
  ev.dataTransfer.dropEffect = "move"
}
function libraryDrop(ev) {
  ev.preventDefault();
  if (ev.target.classList != 'card') return;

  console.log('dropClassList', ev.target.classList);
  let startdata = ev.dataTransfer.getData('library');
  let startsrc = ev.dataTransfer.getData('src');
  console.log('startsrc', startsrc);
  
  let item = document.getElementById(startdata);
  console.log('ev.target',ev.target);
  ev.target.appendChild(item);
  console.log("drop: dropEffect = " + ev.dataTransfer.dropEffect + " ; effectAllowed = " + ev.dataTransfer.effectAllowed);
}
//----------------------- 상품별 상세 수정 -----------------------//

function productDetailDragStart(ev) {
  console.log(`dragstart: target.id = ${ev.target.dataset.category}`);
  //console.log(`dragstart: target.id = ${ev.target.id}`);
  // Add this element's id to the drag payload so the drop handler will
  // know which element to add to its tree
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
  console.log(ev.dataTransfer);
}
function productDetailDrop(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  ev.target.classList.add('click');
  // Print each item's "kind" and "type"
  if (ev.dataTransfer.items) {
    for (const item of ev.dataTransfer.items) {
      console.log(`kind = ${item.kind}, type = ${item.type}`);
    }
  }
}
function productDetailDragover(ev) {
  ev.preventDefault();
  // Set the dropEffect to move
  ev.dataTransfer.dropEffect = "move"
}
function alignClick(event) {
  let textAling = event.target.dataset.position;
  console.log(textAling);
  console.log(`categoryId : ${categoryId}`);
  let article = document.getElementById(categoryId);
  article.dataset.position = textAling;
}
function applyProductBtn() {
  let productWrap = document.querySelector('.product-wrap');
  if(productWrap.dataset.productcode == undefined) return  alert('진열 상품이 선택되지 않았습니다.');
  let data = [];
  let productTemp ={};
  let category = '';
  let getBg = productWrap.dataset.bgcolor;
  productTemp.productcode = productWrap.dataset.productcode;
  productTemp.bgcolor = productWrap.dataset.bgcolor;
  console.log('getBg',getBg);

  [...productWrap.children].forEach((el) =>{
    let childCnt  = el.children.length;
    if(childCnt > 0){
      category = el.children[0].dataset.category;
      console.log('getBg1',getBg);
        data.push({"idx":el.dataset.idx, "bgColor":el.dataset.bgcolor, "category":category, "position":el.dataset.position})
      }
  });


  let productcode = productTemp.productcode;
  productTemp.data = data;
  console.log('productcode',productcode);
  document.getElementById(`${productcode}`).parentElement.parentElement.parentElement.dataset.productcode = productcode;
  console.log('productTemp',productTemp);
  var jsonDataString = JSON.stringify(productTemp) ;
  document.getElementById(`${productcode}`).parentElement.parentElement.previousSibling.value =jsonDataString;
  console.log('jsonData',jsonDataString);


  var jsonDataParse = JSON.parse(jsonDataString);
  console.log('jsonDataParse',jsonDataParse);

}
function categoryClick(ev) {
  ev.preventDefault();
  let alignBtn = document.querySelectorAll(".product-align-btn");
  let childCnt = this.childElementCount;
  categoryId = this.id;
  if (childCnt > 0) {
    alignBtn.forEach((item) => {
      item.classList.add('animate__animated', 'animate__bounce');
      setTimeout(function () {
        item.classList.remove('animate__animated', 'animate__bounce');
      }, 1000);
    });
  }
}
function productDetailAddEvent() {
  const categoryPosition = document.querySelectorAll(".category-position");
  const categoryBtn = document.querySelectorAll(".category-btn");
  categoryPosition.forEach((item) => {
    item.addEventListener("dragstart", productDetailDragStart)
    item.addEventListener("dragover", productDetailDragover)
    item.addEventListener("drop", productDetailDrop)
    item.addEventListener("click", categoryClick)
  });
  categoryBtn.forEach((item) => {
    item.addEventListener("dragstart", productDetailDragStart)
  });
}
function productDetailBgChangeBtn(){
  const bgBtn = document.querySelector('#bg__change__btn');
  const bgInput = document.querySelector('.rgb__input');
  const productWrap = document.querySelector('.product-wrap');
  bgBtn.addEventListener('click', () => {
    if(productWrap.dataset.productcode == undefined) return  alert('진열 상품이 선택되지 않았습니다.');
    let changeBg = bgInput.value;
    productWrap.style.backgroundColor = changeBg;
    productWrap.dataset.bgcolor = changeBg;
  });
}
function productDetailCategoryLoad(){
  const column = document.querySelector('.product-info-wrap');
  let html='';
  
  let category = ['가격','상품명','색상','좋아요','할인가','장바구니'];
  category.forEach((item,index)=>{
    console.log('item',item);
    html += `<div id="category${index}" data-category="${item}" class="category-btn" draggable="true">${item}</div>`;
    console.log(html);
    column.innerHTML = html;
  });
  productDetailAddEvent();
}
//----------------------- 프리뷰 -----------------------//
function previewSetGridBtn() {
  const gridBtn = document.querySelector('.mobile-preview-wrap');
  const setGrid = document.querySelector('.setGrid');
  setGrid.addEventListener('click', () => {
    console.log('클릭');
    if (gridBtn.classList.contains('one-grid')) {
      gridBtn.classList.replace('one-grid', 'two-grid');
      setGrid.style.backgroundColor = '#bfbfbf';
      setGrid.innerHTML = '3 x 3';
      $('.one__wrap').show();
    } else if (gridBtn.classList.contains('two-grid')) {
      gridBtn.classList.replace('two-grid', 'three-grid');
      setGrid.style.backgroundColor = 'red';
      setGrid.innerHTML = '1 x 1';
      $('.one__wrap').show();
    } else {
      gridBtn.classList.replace('three-grid', 'one-grid');
      setGrid.style.backgroundColor = 'blue';
      setGrid.innerHTML = '2 x 2';
      $('.one__wrap').hide();
    }
  });
}
//----------------------- 공통 -----------------------//
function productInfoCall(info){
  const product ={
    id : '1',
    url: '/image/nav3.jpg',
    idx: '1'
  }
    return product[info] || '...?';
}
function gridApplyBtn(){
  let applyData=[];
  let applyData1=[];
  let gridWrap = document.querySelector('.grid');
  [...gridWrap.children].forEach((el)=>{
    let inputVal = el.children[0].value;
    applyData.push(inputVal);
  });
  console.log(applyData);

  for(let i = 0;  i < applyData.length; i++){
    let applyDataParse = JSON.parse(applyData[i])
    applyData1.push(applyDataParse);
  }
  console.log(applyData1);
  //console.log('applyProductDetail',applyProductDetail);
}
function removeAllchild(div) {
  while (div.hasChildNodes()) {
      div.removeChild(div.firstChild);
  }
}
$(document).ready(function () {
  productDetailCategoryLoad();
  console.log(productInfoCall('id'));
  let grid = null;

  let docElem = document.documentElement;
  let demo = document.querySelector(".grid-demo");
  let gridElement = demo.querySelector(".grid");

  let itemContainers = Array.prototype.slice.call(demo.querySelectorAll('.grid-column-content'));
  let columnGrids = [];
  let boardGrid;
  let filterField = demo.querySelector(".filter-field");
  let searchField = demo.querySelector(".search-field");
  let sortField = demo.querySelector(".sort-field");
  let layoutField = demo.querySelector(".layout-field");
  let itemsElement = demo.querySelector(".add-more-items");
  let imgItemsElement = demo.querySelector("#img");
  let productItemsElement = demo.querySelector("#product");
  let characters = "abcdefghijklmnopqrstuvwxyz";
  let filterOptions = ["red", "blue", "green"];
  let dragOrder = [];
  let uuid = 0;
  let filterFieldValue;
  let sortFieldValue;
  let layoutFieldValue;
  let searchFieldValue;

  function initDemo() {
    initGrid();
    // Reset field values.
    searchField.value = "";
    [sortField, filterField, layoutField].forEach(function (field) {
      field.value = field.querySelectorAll("option")[0].value;
    });

    // Set inital search query, active filter, active sort value and active layout.
    searchFieldValue = searchField.value.toLowerCase();
    filterFieldValue = filterField.value;
    sortFieldValue = sortField.value;
    layoutFieldValue = layoutField.value;

    // Search field binding.
    searchField.addEventListener("keyup", function () {
      let newSearch = searchField.value.toLowerCase();
      if (searchFieldValue !== newSearch) {
        searchFieldValue = newSearch;
        filter();
      }
    });

    // Filter, sort and layout bindings.
    filterField.addEventListener("change", filter);
    sortField.addEventListener("change", sort);
    layoutField.addEventListener("change", changeLayout);

    // Add/remove items bindings.
    // addItemsElement.addEventListener("click", addItems);
    imgItemsElement.addEventListener("click", addItems);
    productItemsElement.addEventListener("click", addItems);

    gridElement.addEventListener('click', function (event) {
      event.preventDefault();
      if (elementMatches(event.target, '.card-remove, .card-remove i')) {
        removeItem(event);
      }
      grid.refreshItems();
    });

  }

  function initGrid() {
    let dragCounter = 0;
    grid = new Muuri(gridElement, {
      // items: generateElements(10),
      items: ".item",
      layoutDuration: 400,
      layoutEasing: "ease",
      dragEnabled: true,
      dragSortInterval: 50,
      dragContainer: document.body,
      dragStartPredicate: function (item, event) {
        let isDraggable = sortFieldValue === "order";
        let isRemoveAction = elementMatches(
          event.target,
          ".card-remove, .card-remove i"
        );
        let isAddAction = elementMatches(
          event.target,
          ".card-add, .card-add i"
        );
        return isDraggable && !isRemoveAction && !isAddAction ?
          Muuri.ItemDrag.defaultStartPredicate(item, event) :
          false;
      },
      dragReleaseDuration: 400,
      dragReleseEasing: "ease",
      // visibleStyles: {
      //     backgroundColor:'blue',
      // },
    })
      // .on("dragStart", function(e) {
      //   ++dragCounter;
      //   docElem.classList.add("dragging");
      //   // e.stopPropagation();

      // })
      // .on("dragEnd", function(e) {
      //   if (--dragCounter < 1) {
      //     docElem.classList.remove("dragging");
      //   }
      // })
      .on("move", updateIndices)
      .on("sort", updateIndices);



    columnGrids.push(grid);
  }

  function filter() {
    filterFieldValue = filterField.value;
    grid.filter(function (item) {
      let element = item.getElement();
      let isSearchMatch = !searchFieldValue ?
        true :
        (element.getAttribute("data-title") || "")
          .toLowerCase()
          .indexOf(searchFieldValue) > -1;
      let isFilterMatch = !filterFieldValue ?
        true :
        (element.getAttribute("data-color") || "") === filterFieldValue;
      return isSearchMatch && isFilterMatch;
    });
  }

  function sort() {
    // Do nothing if sort value did not change.
    let currentSort = sortField.value;
    if (sortFieldValue === currentSort) {
      return;
    }

    // If we are changing from "order" sorting to something else
    // let's store the drag order.
    if (sortFieldValue === "order") {
      dragOrder = grid.getItems();
    }

    // Sort the items.
    grid.sort(
      currentSort === "title" ?
        compareItemTitle :
        currentSort === "color" ?
          compareItemColor :
          dragOrder
    );

    // Update indices and active sort value.
    updateIndices();
    sortFieldValue = currentSort;
  }

  function addItems(e) {
    // 새로운 엘리먼트를 생성하기

    let getId = e.target.id;
    if (getId == 'product') {
      // 새 엘리먼트의 디스플레이를 없음으로 표시
      // default.
      let productElems = generateElements(1);
      // 그리드에 요소를 추가하기
      productElems.forEach(function (item) {
        item.style.display = "none";
      });
      let productItems = grid.add(productElems);
    } else if (getId == 'img') {
      let imgElems = imgGenerateElements(1);
      imgElems.forEach(function (item) {
        item.style.display = "none";
      });
      let imgItems = grid.add(imgElems);
    }


    // UI 인덱스 업데이트하기
    updateIndices();


    //드래그 정렬이 활성화되지 않은 경우에만 항목을 정렬하기
    if (sortFieldValue !== "order") {
      grid.sort(
        sortFieldValue === "title" ? compareItemTitle : compareItemColor
      );
      dragOrder = dragOrder.concat(productItems);
      // dragOrder = dragOrder.concat(imgItems);
    }


    // 마지막으로 항목을 필터링한다.
    filter();
    libraryAddEvent();
  }

  function removeItem(event) {
    var elem = elementClosest(event.target, '.item');

    var index = (parseInt($(elem).find('.card-id').text()) - 1);
    grid.remove(grid.getItems(index), {
      removeElements: true
    });
    // grid.hide(elem, {
    //   onFinish: function(items) {
    //     var item = items[0];
    //     console.log('item', item);
    //     grid.remove(item, {
    //       removeElements: true
    //     });
    //     if (sortFieldValue !== 'order') {
    //       var itemIndex = dragOrder.indexOf(item);
    //       if (itemIndex > -1) {
    //         dragOrder.splice(itemIndex, 1);
    //       }
    //     }
    //   }
    // });

    updateIndices();
  }

  function changeLayout() {
    layoutFieldValue = layoutField.value;
    grid._settings.layout = {
      horizontal: false,
      alignRight: layoutFieldValue.indexOf("right") > -1,
      alignBottom: layoutFieldValue.indexOf("bottom") > -1,
      fillGaps: layoutFieldValue.indexOf("fillgaps") > -1
    };
    grid.layout();
  }

  function generateElements(amount) {
    let ret = [];

    for (let i = 0, len = amount || 1; i < amount; i++) {
      let id = ++uuid;
      let color = "blue";
      let bg = "#292929";
      let title = generateRandomWord(2);
      let width = 1;
      let height = 1;
      let itemElem = document.createElement("div");
      let itemTemplate =
        "" +
        '<div style="background-color:'+bg+'" draggable="true" class="item h' +
        height +
        " w" +
        width +
        " " +
        color +
        '" data-id="' +
        id +
        '" data-color="' +
        color +
        '" data-title="' +
        title +
        '">' +
        '<input data-gridinput="'+id+'" type="hidden" class="productInfoTemp" name="productInfoTemp" value="">' +
        '<div class="item-content">' +
        '<div class="card">' +
        '<div class="card-id">' +
        id +
        "</div>" +
        '<div class="card-remove"><i class="material-icons">&#xE5CD;</i></div>' +
        '<div class="card-add" ><i class="material-icons" onclick="imgClick(event);">&#xE5CD;</i></div>' +
        "</div>" +
        "</div>" +
        "</div>";

      itemElem.innerHTML = itemTemplate;
      ret.push(itemElem.firstChild);
    }
    console.log(ret);
    return ret;
  }

  function imgGenerateElements(amount) {
    let ret = [];

    for (let i = 0, len = amount || 1; i < amount; i++) {
      let id = ++uuid;
      let color = "red";
      let title = "이미지";
      let width = 2;
      console.log(width);
      let height = 1;
      let itemElem = document.createElement("div");
      let itemTemplate =
        "" +
        '<div class="item h' +
        height +
        " w" +
        width +
        " " +
        color +
        '" data-id="' +
        id +
        '" data-color="' +
        color +
        '" data-title="' +
        title +
        '">' +
        '<input data-gridinput="'+id+'" type="hidden" class="productInfoTemp" name="productInfoTemp" value="">' +
        '<div class="item-content">' +
        '<div class="card">' +
        '<div class="card-id">' +
        id +
        "</div>" +
        '<div class="card-remove"><i class="material-icons">&#xE5CD;</i></div>' +
        "</div>" +
        "</div>" +
        "</div>";

      itemElem.innerHTML = itemTemplate;
      ret.push(itemElem.firstChild);
    }

    return ret;
  }

  function getRandomItem(collection) {
    return collection[Math.floor(Math.random() * collection.length)];
  }

  function generateRandomWord(length) {
    let ret = "";
    for (let i = 0; i < length; i++) {
      ret += getRandomItem(characters);
    }
    return ret;
  }

  function compareItemTitle(a, b) {
    let aVal = a.getElement().getAttribute("data-title") || "";
    let bVal = b.getElement().getAttribute("data-title") || "";
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  }

  function compareItemColor(a, b) {
    let aVal = a.getElement().getAttribute("data-color") || "";
    let bVal = b.getElement().getAttribute("data-color") || "";
    return aVal < bVal ? -1 : aVal > bVal ? 1 : compareItemTitle(a, b);
  }

  function updateIndices() {
    grid.getItems().forEach(function (item, i) {

      item.getElement().setAttribute("data-id", i + 1);
      console.log('asd',item.getElement().children[0].setAttribute("data-gridinput", i + 1));
      item.getElement().querySelector(".card-id").innerHTML = i + 1;
    });
  }

  function elementMatches(element, selector) {
    let p = Element.prototype;
    return (
      p.matches ||
      p.matchesSelector ||
      p.webkitMatchesSelector ||
      p.mozMatchesSelector ||
      p.msMatchesSelector ||
      p.oMatchesSelector
    ).call(element, selector);
  }

  function elementClosest(element, selector) {
    if (window.Element && !Element.prototype.closest) {
      let isMatch = elementMatches(element, selector);
      while (!isMatch && element && element !== document) {
        element = element.parentNode;
        isMatch =
          element && element !== document && elementMatches(element, selector);
      }
      return element && element !== document ? element : null;
    } else {
      return element.closest(selector);
    }
  }
  
  /*----------------------------------  상품 상세설정 ---------------------------------*/
  const reset = document.querySelector("#reset");
  reset.addEventListener("click", () => document.location.reload());
  const prdocutReset = document.querySelector("#prdocutReset");
  //reset.addEventListener("click", () => document.location.reload());
  
  
  
  prdocutReset.addEventListener("click", () => {
    let categoryPosition= document.querySelectorAll('.category-position'); 
    let productWrap= document.querySelector('.product-wrap'); 
    let productCode = productWrap.dataset.productcode;
    console.log(productCode);
    document.getElementById(`${productCode}`).parentElement.parentElement.previousSibling.value ='';

    categoryPosition.forEach((i)=>{
      removeAllchild(i);
    });
    productDetailCategoryLoad();
  });

  /*----------------------------------  함수 호출 ---------------------------------*/
  initDemo();
  
  libraryDragStart();
  previewSetGridBtn();
  productDetailAddEvent();
  productDetailBgChangeBtn();

  /*----------------------------------  함수 호출 ---------------------------------*/
});