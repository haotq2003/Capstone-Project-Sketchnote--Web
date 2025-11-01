import React from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag } from "antd";

export default function DesignerReportView() {
  const columns = [
    { title: "Asset", dataIndex: "asset", key: "asset" },
    { title: "Type", dataIndex: "type", key: "type", render: (t) => <Tag>{t}</Tag> },
    { title: "Usage", dataIndex: "usage", key: "usage" },
    { title: "Owner", dataIndex: "owner", key: "owner" },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}><Card><Statistic title="Active Assets" value={238} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="Monthly Usage" value={1543} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="Avg. Review Time" value="1.8 days" /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="Approval Rate" value="82%" /></Card></Col>
      </Row>

      <Card title="Adoption Trend">
        <div className="grid grid-cols-12 gap-2 h-24 items-end">
          {[20, 35, 55, 40, 60, 72, 68, 80, 70, 85, 90, 96].map((v, i) => (
            <div key={i} className="bg-indigo-200 rounded-t" style={{ height: `${v}%` }} />
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">Monthly trend of asset usage</div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Asset Health">
            <div className="space-y-3">
              <div>Design System Coverage</div>
              <Progress percent={86} status="active" />
              <div>Motion Library Completeness</div>
              <Progress percent={72} status="active" />
              <div>Icon Set Consistency</div>
              <Progress percent={90} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top Used Assets">
            <Table
              size="small"
              columns={columns}
              dataSource={topAssets}
              rowKey="asset"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const topAssets = [
  { asset: "UI Kit - Buttons", type: "Doc", usage: 423, owner: "Alice" },
  { asset: "Motion Intro", type: "Video", usage: 309, owner: "Bob" },
  { asset: "Icon Set v2", type: "Doc", usage: 287, owner: "Chi" },
];