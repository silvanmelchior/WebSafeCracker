import React from "react";
import Prism from "prismjs";
import Plotly from 'plotly.js-basic-dist';
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/themes/prism-okaidia.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import "./Task.css";
import axios from "axios";


class Task extends React.Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    // Code
    Prism.highlightAll();
    // Image
    [...document.querySelectorAll('[data-imgurl]')].forEach(div => {
      div.innerHTML = 'Loading...';
      let path = div.dataset.imgurl;
      let img = document.createElement('img');
      img.onload = () => {
        div.innerHTML = '';
        div.style.border = '';
        div.className = 'Task-blockimg';
        div.appendChild(img);
      };
      img.src = this.props.task.media_url + path;
    });
    // Graph
    [...document.querySelectorAll('[data-graphurl]')].forEach(div => {
      div.innerHTML = 'Loading...';
      let path = div.dataset.graphurl;

      axios.get(this.props.task.media_url + path).then(response => {
        let inner_div = document.createElement('div');
        inner_div.style.width = '100%';
        inner_div.style.height = '100%';
        inner_div.style.position = 'absolute';
        inner_div.style.top = '0';
        inner_div.style.left = '0';

        div.innerHTML = '';
        div.style.position = 'relative';
        div.style.border = '';
        div.appendChild(inner_div);

        let graph_data = response.data;
        let traces = [];
        for(const key in graph_data.signals) {
          let trace = {
            x: graph_data.signals[key][0],
            y: graph_data.signals[key][1],
            mode: 'lines',
            name: key
          };
          traces.push(trace);
        }
        let layout = {
          showlegend: true,
          margin: {t: 0, l: 50, r: 0, b: 40},
          grid: true,
          xaxis: {
            title: 'Time [s]',
            range: [graph_data.limits.xmin, graph_data.limits.xmax]
          },
          yaxis: {
            title: 'Voltage [V]',
            range: [graph_data.limits.ymin, graph_data.limits.ymax]
          },
        };
        let config = {
          displayModeBar: false,
          responsive: true
        };
        Plotly.newPlot(inner_div, traces, layout, config);
      });
    });
  }

  render() {
    if(this.props.task_pk == null) {
      return <div className="Task-placeholder">Please select a task.</div>
    }
    else if(this.props.task_pk === 'loading') {
      return <div className="Task-placeholder">Loading...</div>
    }
    else {
      return (
        <div>
          <div className="Task-title">{this.props.task.nr}: {this.props.task.title}</div>
          <div dangerouslySetInnerHTML={{ __html: this.props.task.description }} />
        </div>
      )
    }
  }
}

export default Task;
