import React from 'react';

interface CommentManagerProps {
  contentRef: React.RefObject<HTMLDivElement>;
  handleChange: (e: React.FormEvent<HTMLDivElement>) => void;
}

export function CommentManager({ contentRef, handleChange }: CommentManagerProps) {
  /** Add a comment to selected text **/
  function addComment() {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && contentRef.current) {
      const range = selection.getRangeAt(0);
      const commentId = Date.now().toString();
      const commentText = prompt("Enter your comment") || "";
      
      const span = document.createElement('span');
      span.id = `comment-${commentId}`;
      span.title = commentText;
      range.surroundContents(span);

      handleChange({ currentTarget: contentRef.current } as React.FormEvent<HTMLDivElement>);
      selection.removeAllRanges();
    }
  }

  /** Display all comments in document **/
  function showComments() {
    const spanTags = document.getElementsByTagName('span');
    const commentList = document.getElementById("comments-list");
    if (commentList) {
      commentList.innerHTML = "";
    }

    if (spanTags.length > 0) {
      const header = document.createElement('h3');
      header.innerHTML = "Click a comment to remove it:";
      commentList?.appendChild(header);
    }

    Array.from(spanTags).forEach((span) => {
      let listObject = document.createElement('button');
      listObject.onclick = (event) => deleteComment(event, span);
      listObject.innerText = span.textContent ?? "Tomt";
      commentList?.appendChild(listObject);
    });
  }

//   /** Delete a comment from document **/
//   function deleteComment(event: MouseEvent, span: HTMLElement) {
//     var text = document.createTextNode(span.innerHTML);
//     span.parentNode?.insertBefore(text, span);
//     console.log(span);
//     // span.remove();
//     span.parentNode?.removeChild(span);
//     if (event.target instanceof HTMLElement) {
//       event.target.remove();
//     }

//     handleChange({ currentTarget: contentRef.current } as React.FormEvent<HTMLDivElement>);
//   }
/** Delete a comment from document **/
function deleteComment(event: MouseEvent, span: HTMLElement) {
    const actualSpan = document.getElementById(span.id);
    if (!actualSpan) {
        return
    };

    let text = document.createTextNode(span.innerHTML);
    actualSpan.parentNode?.insertBefore(text, actualSpan);
    actualSpan.parentNode?.removeChild(actualSpan);
    if (event.target instanceof HTMLElement) {
      event.target.remove();
    }
    
    handleChange({ currentTarget: contentRef.current } as React.FormEvent<HTMLDivElement>);
  }

  return (
    <>
      <button onClick={addComment}><h3>Add Comment</h3></button>
      <button onClick={showComments}>
        <h3>Show/delete comments</h3>
      </button>
      <div id="comments-list"></div>
      <style>{`
        #content-text span[id^="comment-"] {
          background-color: yellow;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}