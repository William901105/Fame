function debug(message)
{
  console.log(message);
  document.querySelector('.message p').innerText = message;
}

function offsetBetween(from, to)
{
  let
    current = from,
    offset = {'top': 0, 'left': 0};
  while (current !== to)
  {
    offset.top += current.offsetTop;
    offset.left += current.offsetLeft;
    current = current.parentElement;
  }
  return offset;
}

// Create anchor elements in navigation and highlight them corresponding to scrolling targets
function verticalNavigation (content, targets, navigation)
{
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
    offsetCtntBoundingTop = content.getBoundingClientRect().top; // offset relative to viewport
  let
    isScrollBySet = false,
    mousePosY = 0, // offset relative to viewport
    offsetsTrgtToCtnt = []; // offsets relative to content
  
  // Highlight corresponding navigation anchor
  function highlightNavigation (mouseToCtnt)
  {
    offsetsTrgtToCtnt.forEach((offset, index) => {
      if (mouseToCtnt >= offset && mouseToCtnt < offsetsTrgtToCtnt[index + 1]) {
        anchors.forEach((anchor) => {anchor.classList.remove('active');});
        anchors[index].classList.add('active');
      }
    })
  }

  function renew_offsetsTrgtToCtnt () {
    offsetsTrgtToCtnt = [];
    // Record each offsets
    targets.forEach((target) => {
      offsetsTrgtToCtnt.push(offsetBetween(target, content).top);
    });
    // to guarantee less than
    offsetsTrgtToCtnt.push(Number.MAX_SAFE_INTEGER);
  }

  window.addEventListener('resize', renew_offsetsTrgtToCtnt);
  new ResizeObserver(renew_offsetsTrgtToCtnt).observe(document.querySelector('.main>.content'));
  renew_offsetsTrgtToCtnt();

  // Listen for click on each anchor to clear mousePosY
  anchors.forEach((anchor, index) => {
    anchor.addEventListener('click', () => {
      isScrollBySet = true;
      content.scrollTop = offsetsTrgtToCtnt[index];
      highlightNavigation(offsetsTrgtToCtnt[index]);
    });
  });

  // Listen for mouse move to highlightNavigation
  content.addEventListener('mousemove', (event) => {
    mousePosY = event.clientY - offsetCtntBoundingTop; // relative to content
    highlightNavigation(content.scrollTop + mousePosY);
  });

  // Listen for content scroll to highlightNavigation
  content.addEventListener('scroll', () => {
    if (!isScrollBySet) {highlightNavigation(content.scrollTop + mousePosY);}
    else {isScrollBySet = true;}
  });
}

// Close the target if the user clicks outside of it
function deactivateIfClickOutside (trigger, targets, focusIdx)
{
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