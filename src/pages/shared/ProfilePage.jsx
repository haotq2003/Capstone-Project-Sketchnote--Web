import { useCallback, useEffect, useState } from "react";
import { Card, Avatar, Tag, Typography, Descriptions, Button, Spin, Empty } from "antd";
import { message } from "antd";
import { decodeUserFromToken } from "../../util/authUtil";
import { userService } from "../../service/userService";

const { Title, Text } = Typography;

const getInitials = (firstName = "", lastName = "", email = "") => {
  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.trim();
  if (initials) return initials.toUpperCase();
  return email?.charAt(0)?.toUpperCase() || "?";
};

const ProfilePage = ({ roleLabel }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Missing authentication token");
    }

   



    // Gọi trực tiếp API fetchUserById với userId
    const detailResponse = await userService.fetchUserById();
    const detail = detailResponse?.result || detailResponse?.data?.result || detailResponse;

    if (!detail) {
      throw new Error("Unexpected response from profile API");
    }

    setProfile(detail);
    setError(null);
  } catch (err) {
    console.error("Profile load failed", err);
    const messageText = err.message || "Failed to load profile";
    setError(messageText);
    setProfile(null);
    message.error(messageText);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    if (error || !profile) {
      return (
        <div className="py-12">
          <Empty description={error || "Profile data not available"} />
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <Avatar
            size={96}
            src={profile.avatarUrl}
            className="bg-blue-200 text-blue-800 font-semibold"
          >
            {getInitials(profile.firstName, profile.lastName, profile.email)}
          </Avatar>
          <div>
            <Title level={3} className="!mb-1">
              {profile.firstName || profile.lastName
                ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                : profile.email}
            </Title>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* <Tag color="blue">{roleLabel}</Tag> */}
              {profile.role && <Tag color="geekblue">{profile.role}</Tag>}
            </div>
            <Text type="secondary">{profile.email}</Text>
          </div>
        </div>

        <Descriptions bordered column={1} size="middle">
         
         
          <Descriptions.Item label="First Name">{profile.firstName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{profile.lastName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Role">{profile.role || roleLabel}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Your Profile</span>
            
          </div>
        }
      >
        {renderContent()}
      </Card>
    </div>
  );
};

export default ProfilePage;
