type Props = {
  onChangeUser: () => void;
};

const UserChangeButton = ({ onChangeUser }: Props) => {
  return (
    <button className="text-gray-600" onClick={onChangeUser}>
      ユーザーを選び直す
    </button>
  );
};

export default UserChangeButton;
