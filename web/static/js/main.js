function debug(message)
{
  console.log(message);
  document.querySelectorAll('.message p')[0].innerText = message;
}


// Create anchor elements in navigation and highlight them corresponding to scrolling targets
function verticalNavigation (content, targets, navigation)
{
  // Create anchor elements in navigation corresponding to targets
  targets.forEach((target, index) => {
    const a = document.createElement('a');
    a.classList.add('hugfill');
    a.classList.add('fal-h4');
    a.setAttribute('href', `#${target.id}`);
    const p = document.createElement('p');
    p.classList.add('font-sec-header');
    p.innerText = target.innerText;

    a.appendChild(p);
    navigation.appendChild(a);
  });

  // Listen for content scroll to highlight corresponding navigation anchor
  const anchors = Array.prototype.slice.call(navigation.children);
  content.addEventListener('scroll', () => {
    const contentScrollTop = content.scrollTop;
  
    targets.forEach((target, index) => {
      if (content.scrollHeight - contentScrollTop <= content.clientHeight + 1)
      {
        anchors.forEach((anchor) => {anchor.classList.remove('active');});
        anchors[anchors.length - 1].classList.add('active');
        return;
      }
  
      const targetTop = target.offsetTop;
      const nextTargetTop = index < targets.length - 1 ?
        targets[index + 1].offsetTop :
        contentScrollTop + 1; // guarantee less than
        
      if (contentScrollTop >= targetTop && contentScrollTop < nextTargetTop)
      {
        anchors.forEach((anchor) => {anchor.classList.remove('active');});
        anchors[index].classList.add('active');
      }
    });
  });  
}

// Close the popups if the user clicks outside of it
function closePopupIfClickOutside (triggers, popups)
{
  let isTrigger = false; // prevent activate then suddenly deactivate
  triggers.forEach((item) => {
    item.addEventListener('click', () => {
      item.nextElementSibling.classList.toggle('active');
      isTrigger = true;
    });
  });
  
  window.addEventListener('click', (event) => {
    popups.forEach((item) => {
      if (!isTrigger && event.target.nextElementSibling !== item) {
        item.classList.remove('active');
      }
    });
    isTrigger = false;
  });
}


verticalNavigation(
  document.querySelectorAll('.main')[0],
  document.querySelectorAll('.main>.content h2'),
  document.querySelectorAll('.navigation-bar')[0]
);

closePopupIfClickOutside(
  document.querySelectorAll('a.avatar'),
  document.querySelectorAll('.avatar-menu')
);