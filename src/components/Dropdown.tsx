import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEventHandler,
} from "react";
import "../styles/Dropdown.scss";

type DropdownProps = {
  options: Array<string>;
  onSelect: (selectedOption: string) => void;
  selectedOption: string | null;
  id: string;
};

const Dropdown = ({ options, onSelect, selectedOption, id }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownOptionRef = useRef<HTMLDivElement>(null);

  const handleOptionSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    // console.log('dropdownRef.current', dropdownRef.current);
    // dropdownRef.current.focus();

    // Find the index of the currently focused element
    const dropdownOptionRefExists = dropdownOptionRef.current;
    if (dropdownOptionRefExists) {
      let modalExist = dropdownOptionRefExists.closest(".modal");
      if (modalExist) {
        const focusableModalElements = modalExist.querySelectorAll(
          'a, button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="number"], select, input[type="file"], div.selected-option'
        );
        const currentIndex = Array.from(focusableModalElements).indexOf(
          dropdownOptionRef.current
        );
        // console.log('dropdownOptionRef.current', dropdownOptionRef.current);
        // console.log('currentIndex', currentIndex);
        // Focus on the next element
        const nextIndex = currentIndex + 1;
        const nextElement = focusableModalElements[nextIndex];
        // console.log('nextElement', nextElement);
        if (nextElement) {
          (nextElement as HTMLElement)?.focus();
        }

        onSelect(option);
      }
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
      const focusableModalElements =
        dropdownRef.current?.querySelectorAll("li");
      if (focusableModalElements) {
        if (e.key === "Tab") {
          if (isOpen) {
            setIsOpen(false);
            dropdownRef.current?.focus();
          }
        } else if (e.key === "ArrowDown") {
          const firstElement = focusableModalElements[0];
          const lastElement =
            focusableModalElements[focusableModalElements.length - 1];

          // If down arrow is pressed, focus on the next element
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          } else {
            const nextIndex =
              Array.from(focusableModalElements).indexOf(
                document.activeElement
                  ? (document.activeElement as HTMLLIElement)
                  : (firstElement as HTMLLIElement)
              ) + 1;
            focusableModalElements[nextIndex]?.focus();
            e.preventDefault();
          }
        } else if (e.key === "ArrowUp") {
          const firstElement = focusableModalElements[0];
          const lastElement =
            focusableModalElements[focusableModalElements.length - 1];

          // If up arrow is pressed, focus on the previous element
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else {
            const prevIndex =
              Array.from(focusableModalElements).indexOf(
                document.activeElement as HTMLLIElement
              ) - 1;
            focusableModalElements[prevIndex]?.focus();
            e.preventDefault();
          }
        }
      }
    },
    [dropdownRef, isOpen]
  );

  const keyListenersMap = new Map<number, (e: KeyboardEvent) => void>([
    [27, () => setIsOpen(false)],
    [40, handleTabKey],
    [38, handleTabKey],
    [9, handleTabKey],
  ]);

  useEffect(() => {
    function keyListener(e: KeyboardEvent) {
      const listener = keyListenersMap.get(e.keyCode);
      return listener && listener(e);
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  });

  return (
    <div
      id={id}
      className={`dropdown ${isOpen ? "open" : ""}`}
      ref={dropdownRef}
    >
      <div
        ref={dropdownOptionRef}
        className="selected-option"
        onClick={handleToggleDropdown}
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === " " || e.key === "Enter") {
            handleToggleDropdown();
            handleTabKey(e);
          }
        }}
      >
        {selectedOption !== null ? selectedOption : "Select an option"}
      </div>
      {isOpen && (
        <ul
          className="dropdown-options"
          role="listbox"
          aria-multiselectable={false}
        >
          {options.map((option) => (
            <li
              tabIndex={0}
              className="dropdown-option"
              key={option}
              onClick={() => handleOptionSelect(option)}
              role="option"
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleOptionSelect(option);
                  // setIsOpen(false);
                }
              }}
              aria-selected={selectedOption === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
