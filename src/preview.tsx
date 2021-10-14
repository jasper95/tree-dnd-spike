// @ts-ignore
import { usePreview } from 'react-dnd-preview'

export default function MyPreview() {
  const {display, item, style} = usePreview()
  if (!display) {
    return null
  }
  return (
    <div className="rst__row" style={{...style, opacity: .5, height: 40 }}>
      <div className="rst__moveHandle" draggable="true"></div>
        <div className="rst__rowContents">
          <div className="rst__rowLabel">
          <span className="rst__rowTitle">{item?.node?.title}</span>
          </div>
        <div className="rst__rowToolbar"></div>
      </div>
    </div>
  )
}