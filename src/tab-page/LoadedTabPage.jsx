import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { getConfig } from '@edx/frontend-platform';
import { useToggle } from '@edx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { CourseTabsNavigation } from '../course-tabs';
import { useModel } from '../generic/model-store';
import { AlertList } from '../generic/user-messages';
import StreakModal from '../shared/streak-celebration';
import InstructorToolbar from '../instructor-toolbar';
import useEnrollmentAlert from '../alerts/enrollment-alert';
import useLogistrationAlert from '../alerts/logistration-alert';


function LoadedTabPage({
  activeTabSlug,
  children,
  courseId,
  metadataModel,
  unitId,
}) {
  const {
    originalUserIsStaff,
    tabs,
    title,
    celebrations,
    canViewLegacyCourseware,
    verifiedMode,
  } = useModel(metadataModel, courseId);

  // Logistration and enrollment alerts are only really used for the outline tab, but loaded here to put them above
  // breadcrumbs when they are visible.
  const logistrationAlert = useLogistrationAlert(courseId);
  const enrollmentAlert = useEnrollmentAlert(courseId);
  
  const activeTab = tabs.filter(tab => tab.slug === activeTabSlug)[0];
  
  const streakLengthToCelebrate = celebrations && celebrations.streakLengthToCelebrate;
  const StreakDiscountCouponEnabled = celebrations && celebrations.streakDiscountEnabled && verifiedMode;
  const [isStreakCelebrationOpen,, closeStreakCelebration] = useToggle(streakLengthToCelebrate);
  
  const { courseId: courseIdFromUrl } = useParams();
  const [courseFont, setCourseFont] = useState("")

  useEffect(()=>{
    let url = `${getConfig().LMS_BASE_URL}/wikimedia_general/api/v0/wiki_metadata/${courseIdFromUrl}`;
    getAuthenticatedHttpClient().get(url).then(({data})=>{
      setCourseFont(data.course_font)
    })
  },[courseIdFromUrl])

  return (
    <>
      <Helmet>
        <title>{`${activeTab ? `${activeTab.title} | ` : ''}${title} | ${getConfig().SITE_NAME}`}</title>
      </Helmet>
      {originalUserIsStaff && (
        <InstructorToolbar
          courseId={courseId}
          unitId={unitId}
          canViewLegacyCourseware={canViewLegacyCourseware}
          tab={activeTabSlug}
        />
      )}
      <StreakModal
        courseId={courseId}
        metadataModel={metadataModel}
        streakLengthToCelebrate={streakLengthToCelebrate}
        isStreakCelebrationOpen={!!isStreakCelebrationOpen}
        closeStreakCelebration={closeStreakCelebration}
        StreakDiscountCouponEnabled={StreakDiscountCouponEnabled}
        verifiedMode={verifiedMode}
      />
      <main id="main-content" className={`d-flex flex-column flex-grow-1 ${courseFont}`}>
        <AlertList
          topic="outline"
          className="mx-5 mt-3"
          customAlerts={{
            ...enrollmentAlert,
            ...logistrationAlert,
          }}
        />
        <CourseTabsNavigation tabs={tabs} className="mb-3" activeTabSlug={activeTabSlug} />
        <div className="container-xl">
          {children}
        </div>
      </main>
    </>
  );
}

LoadedTabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
  metadataModel: PropTypes.string,
  unitId: PropTypes.string,
};

LoadedTabPage.defaultProps = {
  children: null,
  metadataModel: 'courseHomeMeta',
  unitId: null,
};

export default LoadedTabPage;
