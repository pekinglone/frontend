import { Carousel, Card } from 'antd';
import React from 'react';
import mbtype1 from '../../img/mbtype_1.png';
import mbtype2 from '../../img/mbtype_2.png';
import mbtype3 from '../../img/mbtype_3.png';
export default class SelectTemplate extends React.Component {
  constructor() {
      super();
      this.state = {
        mblx: ""
      };
  }
  render() {
    return(
      <div>
	      <Carousel autoplay>
          <Card
            cover={<img alt="example" src={mbtype1} />}
          >
            <Card.Meta title="【模板一】 适用于考核部门" description="支持对一个部门的多项指标进行多个维度的描述" />
          </Card>
          <Card
            cover={<img alt="example" src={mbtype2} />}
          >
            <Card.Meta title="【模板二】 适用于考核个人" description="支持对个人的多种品质进行定性考核" />
          </Card>
          <Card
            cover={<img alt="example" src={mbtype3} />}
          >
            <Card.Meta title="【模板三】 适用于考核个人" description="支持对个人的多项工作进行多个维度的描述" />
          </Card>
        </Carousel>
        <h3 style={{marginTop: '2%'}}>请根据上图选择考核模板类型</h3>
      </div>
    );
  }
}