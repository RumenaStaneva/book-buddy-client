import "../styles/Modal.scss";
import React, {
  createContext,
  useEffect,
  createRef,
  ReactNode,
  RefObject,
} from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { clearError } from "../reducers/errorSlice";
import { createPortal } from "react-dom";
import Button from "./Button";
import { useAppSelector } from "../hooks/basicHooks";

const modalContext = createContext<ModalContextValue | null>(null);

type ModalContextValue = {
  setIsOpen: (isOpen: boolean) => void;
};

type ModalProps = {
  title: string;
  content: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  subtitle: string;
  small?: boolean;
  disableCloseButton?: boolean;
  previousElement: Element;
};

export default function Modal({
  title,
  content,
  setIsOpen,
  subtitle,
  small,
  disableCloseButton,
  previousElement,
}: ModalProps) {
  const dispatchError = useDispatch();
  const modalRef: RefObject<HTMLDivElement> = createRef();
  const { hasError } = useAppSelector((state) => state.error);

  // console.log('modalRef.current', modalRef.current);
  useEffect(() => {
    if (modalRef.current) {
      const focusableModalElements = modalRef.current.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="number"], select, input[type="file"], div.selected-option, .error-message__container.close-btn'
      );
      //this is confusing  my upload so dont use it
      if (focusableModalElements.length > 0 && !hasError) {
        (focusableModalElements[0] as HTMLElement)?.focus();
      }

      if (focusableModalElements.length > 0 && hasError) {
        (
          focusableModalElements[
            focusableModalElements.length - 2
          ] as HTMLElement
        ).focus();
      }

      const handleTabKey = (e: KeyboardEvent) => {
        const firstElement = focusableModalElements[0];
        const lastElement =
          focusableModalElements[focusableModalElements.length - 1];

        if (e.key === "Tab") {
          if (e.shiftKey) {
            // If shift key is pressed, focus on the previous element
            if (document.activeElement === firstElement) {
              (lastElement as HTMLElement)?.focus();
              e.preventDefault();
            }
          } else {
            // If shift key is not pressed, focus on the next element
            if (document.activeElement === lastElement) {
              (firstElement as HTMLElement)?.focus();
              e.preventDefault();
            }
          }
        }
      };

      const keyListenersMap = new Map([
        [
          27,
          () => {
            setIsOpen(false);
            dispatchError(clearError());
            document.body.style.overflow = "visible";
            (previousElement as HTMLElement)?.focus();
          },
        ],
        [9, handleTabKey],
      ]);

      const keyListener = (e: KeyboardEvent) => {
        const listener = keyListenersMap.get(e.keyCode);
        listener && listener(e);
      };

      document.addEventListener("keydown", keyListener);

      return () => {
        document.removeEventListener("keydown", keyListener);
      };
    }
  }, [setIsOpen, dispatchError, modalRef, hasError, previousElement]);

  return createPortal(
    <>
      <div
        className={`darkBG ${small ? "modal-sm" : ""}`}
        onClick={() => {
          if (!disableCloseButton) {
            setIsOpen(false);
            (previousElement as HTMLElement)?.focus();
            document.body.style.overflow = "visible";
          }
        }}
      />
      <div
        className={`modal ${small ? "modal-sm" : ""}`}
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        // onFocus={handleTabKey}
      >
        {!disableCloseButton ? (
          <Button
            aria-label="Close"
            className="closeBtn"
            onClick={() => {
              setIsOpen(false);
              (previousElement as HTMLElement).focus();
              dispatchError(clearError());
              document.body.style.overflow = "visible";
            }}
          >
            <IoIosClose />
          </Button>
        ) : null}
        <div className="modalHeader">
          <h2 className="modal-heading">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="modal-content__container">
          <div className="modalContent">
            <modalContext.Provider value={{ setIsOpen }}>
              {content}
            </modalContext.Provider>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
