'use client'
import { ProfileHeader, ProfileInfoCard, ProfileInfoItem } from "@/src/components/profile";
import { useApp } from "@/src/contexts/AppContext";

export default function ProfilePage() {
    const { userProfile, userProfileLoading, userProfileError } = useApp();
    if(userProfileLoading) return <div>Loading...</div>
    if(userProfileError) return <div>Error: {userProfileError}</div>
    if(!userProfile) return <div>No profile found</div>
    return (
        <>
        <ProfileHeader profile={userProfile} />
        <ProfileInfoCard>
            <ProfileInfoItem label="Email" value={userProfile.email} />
            <ProfileInfoItem label="Phone" value={userProfile.phone} />
            <ProfileInfoItem label="Role" value={userProfile.role} />
            <ProfileInfoItem label="Gym ID" value={userProfile.gym_id} />
        </ProfileInfoCard>
        </>
    )
}
