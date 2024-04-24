import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import {
  resetFilters,
  setActiveImage,
  setFilters,
  setNewImage,
} from "./store/imagesSlice";
import clsx from "clsx";

async function fetchUnSplash() {
  const res = await fetch("https://source.unsplash.com/random");
  const imageUrl = await res.url;
  return imageUrl;
}

function App() {
  const { data: images, activeImageId } = useSelector(
    (state: RootState) => state.images
  );
  const dispatch = useDispatch();

  const currentImageIndex = images.findIndex(
    (image) => image.id === activeImageId
  );
  const activeImage =
    currentImageIndex != -1 ? images[currentImageIndex] : images[0];

  const imageFiltersStyle = {
    filter: `grayscale(${activeImage.filters.grayscale}%) saturate(${activeImage.filters.saturate}%) brightness(${activeImage.filters.brightness}) contrast(${activeImage.filters.contrast}%)`,
  };

  const getNewImage = async () => {
    const url = await fetchUnSplash();
    const id = crypto.randomUUID();
    dispatch(setNewImage({ id, url }));
    dispatch(setActiveImage(id));
  };

  useEffect(() => {
    //You might see 2 images being fetched initially.
    // This is due to useEffect will run twice in development.
    getNewImage();
  }, []);

  return (
    <div>
      <div className="w-full my-4 px-6">
        <h1 className="font-bold text-xl">Premagic Test - Manoj</h1>
      </div>
      <div className="flex w-full h-full">
        <div className="w-1/2 min-h-screen bg-slate-50 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3>{activeImage.id}</h3>
            <button
              className="px-4 bg-blue-600 text-white rounded-sm"
              onClick={getNewImage}
            >
              New
            </button>
          </div>
          <div className="w-full h-[350px] border rounded-lg mt-6">
            {currentImageIndex != -1 && (
              <img
                src={activeImage.url}
                alt=""
                className="w-full h-full object-fill"
                style={imageFiltersStyle}
              />
            )}
          </div>
          <div className="my-4 w-full">
            <h2 className="font-semibold text-lg">Recent Images</h2>
            <div className="flex items-center space-x-2 mt-4 overflow-x-scroll">
              {images.map(
                (item) =>
                  item.id != "" && (
                    <div
                      key={item.id}
                      className={clsx(
                        "min-w-32 w-32 h-32 px-2 border-red-400 rounded-md",
                        {
                          "border-2": item.id === activeImageId,
                        }
                      )}
                      onClick={() => dispatch(setActiveImage(item.id))}
                    >
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-contain"
                        style={{
                          filter: `grayscale(${item.filters.grayscale}%) saturate(${item.filters.saturate}%) brightness(${item.filters.brightness}) contrast(${item.filters.contrast}%)`,
                        }}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        <div className="w-1/2 min-h-screen bg-gray-200 px-8 py-6">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                className="px-text-blue-600 underline"
                onClick={() => dispatch(resetFilters())}
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-4">
              <InputRange
                name="black-n-white"
                value={activeImage.filters.grayscale}
                onChange={(val: number) =>
                  dispatch(
                    setFilters({
                      ...activeImage.filters,
                      grayscale: val,
                    })
                  )
                }
              />
              <InputRange
                name="saturation"
                value={activeImage.filters.saturate}
                onChange={(val: number) =>
                  dispatch(
                    setFilters({
                      ...activeImage.filters,
                      saturate: val,
                    })
                  )
                }
              />
              <InputRange
                step={0.1}
                max={1}
                name="brightness"
                value={activeImage.filters.brightness}
                onChange={(val: number) =>
                  dispatch(
                    setFilters({
                      ...activeImage.filters,
                      brightness: val,
                    })
                  )
                }
              />
              <InputRange
                step={1}
                min={100}
                max={200}
                name="contrast"
                value={activeImage.filters.contrast}
                onChange={(val: number) =>
                  dispatch(
                    setFilters({
                      ...activeImage.filters,
                      contrast: val,
                    })
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputRange({
  min = 0,
  max = 100,
  step = 1,
  name,
  value,
  onChange,
}: {
  min?: number;
  max?: number;
  step?: number;
  name: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="uppercase">
          {name}
        </label>
        <p>{value}</p>
      </div>
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        step={step}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}

export default App;
