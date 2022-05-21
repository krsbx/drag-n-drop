import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import DragInformations from './DragInformation';

const DragnDrop = ({
  onFileDrop,
  messages,
  disabled = false,
  extensions = [],
  ...props
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  let dragCounter = 0;

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter++;

    if (!e.dataTransfer) return;

    const files = e.dataTransfer.items;

    if (_.isEmpty(files)) return;

    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter--;

    if (dragCounter > 0) return;
    setIsDragging(false);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const _handleFileDrop = (files: FileList) => {
    if (disabled) return;

    if (_.isEmpty(extensions)) {
      onFileDrop?.(files);
      return;
    }

    const filteredFiles = _.filter(files, (file) =>
      _.includes(
        _.map(extensions, (extension) => _.includes(file.name, extension)),
        true
      )
    );

    if (_.isEmpty(filteredFiles)) {
      // Insert error information in here
      return;
    }

    onFileDrop?.(filteredFiles);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    if (!e.dataTransfer) return;

    const files = e.dataTransfer.files;

    if (_.isEmpty(files)) return;

    _handleFileDrop(files);

    e.dataTransfer.clearData();
    dragCounter = 0;
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.addEventListener('dragenter', handleDragIn);
    container.addEventListener('dragleave', handleDragOut);
    container.addEventListener('dragover', handleDrag);
    container.addEventListener('drop', handleDrop);

    return () => {
      container.removeEventListener('dragenter', handleDragIn);
      container.removeEventListener('dragleave', handleDragOut);
      container.removeEventListener('dragover', handleDrag);
      container.removeEventListener('drop', handleDrop);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} style={{ position: 'absolute' }}>
      <DragInformations messages={messages} isVisible={isDragging} />
    </div>
  );
};

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
  onFileDrop?: (files: FileList | File[]) => void;
  disabled?: boolean;
  messages?: string;
  extensions?: string | string[];
};

export default DragnDrop;
