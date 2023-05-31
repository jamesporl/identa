import React, {
  useContext, useRef, useState, useCallback,
} from 'react';
import { Button, Space } from 'antd';
import Cropper, { ReactCropperElement } from 'react-cropper';
import ModalContext from 'client/core/mobx/Modal';
import 'cropperjs/dist/cropper.css';

function CropImage() {
  const cropperRef = useRef<ReactCropperElement>(null);

  const [croppedImgSrc, setCroppedImgSrc] = useState('');

  const modalCtx = useContext(ModalContext);

  const {
    src, type, onSubmit, aspectRatio = 1,
  } = modalCtx.modalContext as {
    src: string, type: string, aspectRatio?: number, onSubmit: (b64: string) => void
  };

  const handleClickSubmit = useCallback(() => {
    onSubmit(croppedImgSrc);
    modalCtx.closeModal();
  }, [croppedImgSrc]);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      setCroppedImgSrc(cropper?.getCroppedCanvas().toDataURL(type));
    }
  };

  return (
    <>
      <Cropper
        src={src}
        style={{ width: '100%', maxHeight: '512px' }}
        aspectRatio={aspectRatio}
        guides={false}
        crop={onCrop}
        autoCropArea={1}
        rotatable={false}
        ref={cropperRef}
      />
      <div className="footer">
        <Space size={8}>
          <Button type="primary" ghost onClick={modalCtx.closeModal}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleClickSubmit}>
            Submit
          </Button>
        </Space>
      </div>
    </>
  );
}

export default CropImage;
