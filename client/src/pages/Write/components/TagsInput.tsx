import { useDispatch, useSelector } from 'react-redux';
import { TAG, TAG_INPUT_PLACEHOLDER } from '../../../common/util/constantValue';
import { RootState } from '../../../common/store/RootStore';
import { setCreatedPost } from '../store/CreatedPost';
import { PostData } from '../../../common/type';
import { MdCancel } from 'react-icons/md';
import { styled } from 'styled-components';

export default function TagsInput({ data }: { data: PostData }) {
  const dispatch = useDispatch();

  const tags: string[] = useSelector(
    (state: RootState) => state.createdPost.tags,
  );

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const tag = event.currentTarget.value;
      if (tag !== '' && !tag.includes(' ') && !tags.includes(tag)) {
        dispatch(setCreatedPost({ ...data, tags: [...tags, tag] }));
        event.currentTarget.value = '';
      }
    }
  };

  const handleDeleteTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    dispatch(setCreatedPost({ ...data, tags: updatedTags }));
  };

  return (
    <>
      <label htmlFor="tags">{TAG}</label>
      <input
        type="text"
        name="tags"
        placeholder={TAG_INPUT_PLACEHOLDER}
        onKeyUp={(e) => handleKeyUp(e)}
      />
      <Tags>
        {tags.map((tag) => {
          return (
            <div key={tag}>
              {`#${tag}`}
              <span onClick={() => handleDeleteTag(tag)}>
                <MdCancel />
              </span>
            </div>
          );
        })}
      </Tags>
    </>
  );
}

const Tags = styled.div`
  display: flex;
  font-size: var(--font-size-s);

  > div {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    padding: 0.5rem;
    border-radius: 5px;
    background: var(--color-gray);

    > span {
      margin-left: 0.5rem;
      cursor: pointer;
    }
  }
`;