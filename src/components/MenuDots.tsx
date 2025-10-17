import React from "react";

interface MenuDotsProps {
  handleRemoveRoomHistory: () => void;
}

const MenuDots = ({handleRemoveRoomHistory}: MenuDotsProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <div>
      <button
        className="absolute top-2 right-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen && <span>メニューを閉じる</span>}
        {!isOpen && <span>メニューを開く</span>}
        <img src="/menu-dots.svg" alt="削除" className="w-3.5 h-3.5 " />
      </button>
      {isOpen && <MenuItems onDelete={handleRemoveRoomHistory} />}
    </div>
  );
};

interface MenuItemsProps {
  onDelete: () => void;
}

const MenuItems = ({onDelete}: MenuItemsProps) => {
  return (
    <div>
      <button
        className="text-sm text-rose-700 mx-auto absolute top-8 right-7"
        onClick={onDelete}
      >
        削除
      </button>
    </div>
  );
};

export default MenuDots;
