interface Props {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ visible, title, children, onClose }: Props) {
  return visible && (
    <div className="fixed z-50 top-0 left-0 flex justify-center items-center w-full h-full bg-[#0006]">
      <div className="flex flex-col rounded-md p-4 bg-white" onBlur={onClose}>
        <header className="flex flex-col gap-4 min-w-[400px]">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{title}</h4>
            <button
              className="btn-close py-2 px-4 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              x
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
