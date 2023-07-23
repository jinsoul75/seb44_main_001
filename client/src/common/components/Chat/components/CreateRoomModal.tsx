import Modal from 'react-modal';
import { createRoomModalStyle } from '../createRoomModalStyle';
import { styled } from 'styled-components';
import { ChangeEvent, useState, KeyboardEvent } from 'react';
import Button from '../../Button';
import { useMutation } from 'react-query';
import postNewRoomName from '../api/postNewRoomName';
import { BASE_URL } from '../../../util/constantValue';
import { NewRoom } from '../../../type';
import { useDispatch } from 'react-redux';
import { setChatModal } from '../../../store/ChatModalStore';
import { setChatRoomInfo } from '../../../store/ChatRoomInfoStore';

export default function CreateRoomModal({
  isOpen,
  setCreateRoomModal,
}: {
  isOpen: boolean;
  setCreateRoomModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [roomName, setRoomName] = useState('');

  const dispatch = useDispatch();

  const memberId = Number(localStorage.getItem('MemberId'));

  const data: NewRoom = {
    memberId: memberId,
    roomName: roomName,
    roomType: 'GROUP',
  };

  const postMutation = useMutation(
    'createRoom',
    () => postNewRoomName(`${BASE_URL}/rooms/register`, data),
    {
      onSuccess: (data) => {
        dispatch(setChatModal(true));
        dispatch(
          setChatRoomInfo({
            roomId: data,
            roomName: roomName,
            roomType: 'GROUP',
          }),
        );
        setRoomName('');
      },
    },
  );

  const handleModalClose = () => {
    setCreateRoomModal(false);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = () => {
    postMutation.mutate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && roomName.length) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      style={createRoomModalStyle}
      onRequestClose={handleModalClose}
      ariaHideApp={false}
    >
      <RoomNameInput
        placeholder="생성할 그룹채팅방의 이름을 입력해주세요!"
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        maxLength={15}
      />
      <Button onClick={handleSubmit}>그룹채팅방 생성</Button>
    </Modal>
  );
}

const RoomNameInput = styled.input`
  width: 100%;
  margin-bottom: 1rem;
`;
