function debug(message) {
  console.log(message);
  document.querySelector('.message p').innerText = message;
}

function offsetBetween(from, to) {
  if (!from || !to) {return;}

  let
    walker = from,
    offset = {'top': 0, 'left': 0};
  while (walker !== to)
  {
    offset.top += walker.offsetTop;
    offset.left += walker.offsetLeft;
    walker = walker.parentElement;
  }
  return offset;
}

// Create anchor elements in navigation and highlight them corresponding to scrolling targets
function verticalNavigation (container, targets, navigation)
{
  if (!container || !targets || !navigation) {return;}

  // Create anchor elements in navigation corresponding to targets
  targets.forEach((target, index) => {
    const a = document.createElement('a');
    a.setAttribute('class', "hugfill fal-h4");
    a.setAttribute('href', `#${target.id}`);
    const p = document.createElement('p');
    p.setAttribute('class', "font-sec-header");
    p.innerText = target.innerText;
    a.appendChild(p);
    if (index == 0) {a.classList.add('active');}

    navigation.appendChild(a);
  });
  
  
  const
    anchors = Array.from(navigation.children), // put navigation.children into array
    offsetCtnrBoundingTop = container.getBoundingClientRect().top; // offset relative to viewport
  let
    isScrollBySet = false,
    mousePosY = 0, // offset relative to viewport
    offsetsTrgtToCtnr = []; // offsets relative to container
  
  // Highlight corresponding navigation anchor
  function highlightNavigation (mouseToCtnr)
  {
    offsetsTrgtToCtnr.forEach((offset, index) => {
      if (mouseToCtnr >= offset && mouseToCtnr < offsetsTrgtToCtnr[index + 1]) {
        anchors.forEach((anchor) => {anchor.classList.remove('active');});
        anchors[index].classList.add('active');
      }
    })
  }

  function renew_offsetsTrgtToCtnr () {
    offsetsTrgtToCtnr = [];
    // Record each offsets
    targets.forEach((target) => {
      offsetsTrgtToCtnr.push(offsetBetween(target, container).top);
    });
    // to guarantee less than
    offsetsTrgtToCtnr.push(Number.MAX_SAFE_INTEGER);
  }

  window.addEventListener('resize', renew_offsetsTrgtToCtnr);
  new ResizeObserver(renew_offsetsTrgtToCtnr).observe(document.querySelector('.main>.content'));
  renew_offsetsTrgtToCtnr();

  // Listen for click on each anchor to clear mousePosY
  anchors.forEach((anchor, index) => {
    anchor.addEventListener('click', () => {
      isScrollBySet = true;
      container.scrollTop = offsetsTrgtToCtnr[index];
      highlightNavigation(offsetsTrgtToCtnr[index]);
    });
  });

  // Listen for mouse move to highlightNavigation
  container.addEventListener('mousemove', (event) => {
    mousePosY = event.clientY - offsetCtnrBoundingTop; // relative to container
    highlightNavigation(container.scrollTop + mousePosY);
  });

  // Listen for container scroll to highlightNavigation
  container.addEventListener('scroll', () => {
    if (!isScrollBySet) {highlightNavigation(container.scrollTop + mousePosY);}
    else {isScrollBySet = true;}
  });
}

// Close `target` if the user clicks outside of it
function deactivateIfClickOutside (trigger, targets, focusIdx)
{
  if (!trigger || !targets) {return;}

  try {targets.forEach(() => {});}
  catch (e) {targets = [targets];}

  trigger.addEventListener('click', () => {
    targets.forEach((target) => {target.classList.toggle('active');});
    if (typeof focusIdx !== 'undefined') {targets[focusIdx].focus();}
  });
  
  window.addEventListener('click', (event) => {
    if (event.target == trigger || Array.from(trigger.childNodes).includes(event.target) || targets.includes(event.target)) {return;}
    
    targets.forEach((target) => {
      target.classList.remove('active');
    });
    if (typeof focusIdx !== 'undefined') {targets[focusIdx].blur();}
  });
}

// once an input has value, atcivate from it to `container`
function exclusiveInputs (container) {
  if (!container) {return;}

  container.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value.length > 0) {
        let walker = input;
        while (walker != container.parentElement) {
          walker.classList.add('active');
          walker = walker.parentElement;
        }
      }
      else {
        let walker = input;
        while (walker != container.parentElement) {
          walker.classList.remove('active');
          walker = walker.parentElement;
        }
      }
    });

    const button = input.parentElement.querySelector('button');
    if (!button) {return;}
    button.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });
  });
}

// prevent default 'enter' key action in a scope
function preventDefaultEnter (scope) {
  if (!scope) {return;}

  scope.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {event.preventDefault();}
  });
}


verticalNavigation(
  document.querySelector('.main'),
  document.querySelectorAll('.main>.content h2'),
  document.querySelector('.navigation-bar')
);

deactivateIfClickOutside(
  document.querySelector('.avatar'),
  document.querySelector('.avatar-menu')
);
document.querySelectorAll('.new-item').forEach((new_item) => {
  deactivateIfClickOutside(
    new_item.querySelector('button'),
    [new_item.querySelector('button'), new_item.querySelector('input')],
    1
  );
});

exclusiveInputs(document.querySelector('.exclusive-inputs'));

preventDefaultEnter(document.querySelector('form.submit'));