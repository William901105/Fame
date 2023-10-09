function debug(message)
{
  console.log(message);
  document.querySelectorAll('.message p')[0].innerText = message;
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
    anchors = Array.prototype.slice.call(navigation.children), // put navigation.children into array
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
  

  // Record each offsets
  targets.forEach((target, index) => {
    if (index == 0) {offsetsTrgtToCtnt.push(offsetBetween(targets[0], content).top);}
    else {offsetsTrgtToCtnt.push(offsetsTrgtToCtnt[0] - targets[0].offsetTop + target.offsetTop);}
  });
  // to guarantee less than
  offsetsTrgtToCtnt.push(Number.MAX_SAFE_INTEGER);
  
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

// Close the popups if the user clicks outside of it
function closePopupIfClickOutside (trigger, popup)
{
  let isTriggerClicked = false; // prevent activation followed by immediate deactivation
  trigger.addEventListener('click', () => {
    popup.classList.toggle('active');
    isTriggerClicked = true;
  });
  
  window.addEventListener('click', (event) => {
    if (!isTriggerClicked && event.target.nextElementSibling !== popup) {popup.classList.remove('active');}
    isTriggerClicked = false;
  });
}


verticalNavigation(
  document.querySelectorAll('.main')[0],
  document.querySelectorAll('.main>.content h2'),
  document.querySelectorAll('.navigation-bar')[0]
);

closePopupIfClickOutside(
  document.querySelectorAll('a.avatar')[0],
  document.querySelectorAll('.avatar-menu')[0]
);