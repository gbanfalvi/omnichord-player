import { h } from 'preact'
import { ContainerControlWidget } from '../../../view-models/controls/widgets/container/ContainerControlWidget'
import { isContainerWidget, isContRangeWidget, isDiscRangeWidget, isToggleWidget, Widget } from '../../../view-models/controls/widgets/Widget'
import { ContainerWidget } from './ContainerWidget'
import { ContRangeWidget } from './ContRangeWidget'
import { DiscRangeWidget } from './DiscRangeWidget'
import { ToggleWidget } from './ToggleWidget'

interface AbstractWidgetProps {
    widget: Widget
}

export function AbstractWidget(props: AbstractWidgetProps) {

    const isContainer = isContainerWidget(props.widget)

    return <div className={`AbstractWidget ${isContainer ? 'container' : 'control'}`}>
        <div className={`Specialized ${isContainer ? 'container' : 'control'}`}>
            {isContainerWidget(props.widget) &&
                <ContainerWidget containerWidget={props.widget} />
            }

            {isToggleWidget(props.widget) &&
                <ToggleWidget toggleWidget={props.widget} />
            }

            {isDiscRangeWidget(props.widget) &&
                <DiscRangeWidget discRangeWidget={props.widget} />
            }

            {isContRangeWidget(props.widget) &&
                <ContRangeWidget contRangeWidget={props.widget} />
            }
        </div>
        {props.widget.title !== null &&
            <div className={`WidgetLabel ${isContainer ? 'container' : 'control'}`}>{props.widget.title}</div>
        }
    </div>
}