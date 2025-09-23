import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RoundNavigationControlsProps {
  currentRound: number;
  setCurrentRound: (round: number) => void;
  numRounds: number;
}

const RoundNavigationControls = ({
  currentRound,
  setCurrentRound,
  numRounds,
}: RoundNavigationControlsProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const handlePreviousRound = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
    }
  };

  const handleNextRound = () => {
    if (currentRound < numRounds - 1) {
      setCurrentRound(currentRound + 1);
    }
  };

  const displayCurrentRoundText = numRounds === 0
    ? t('score_list_page.no_rounds')
    : `${t('round')} ${currentRound + 1}`;

  const isPreviousDisabled = numRounds === 0 || currentRound === 0;
  const isNextDisabled = numRounds === 0 || currentRound === numRounds - 1;

  const previousRoundButton = (
    <Button
      onClick={handlePreviousRound}
      disabled={isPreviousDisabled}
      className="flex-grow"
    >
      {isRTL ? <ChevronRight className="h-5 w-5 ml-2" /> : <ChevronLeft className="h-5 w-5 mr-2" />}
      {t('common.previous_round')}
    </Button>
  );

  const nextRoundButton = (
    <Button
      onClick={handleNextRound}
      disabled={isNextDisabled}
      className="flex-grow"
    >
      {t('common.next_round')}
      {isRTL ? <ChevronLeft className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 ml-2" />}
    </Button>
  );

  if (numRounds === 0) {
    return (
      <div className="text-center text-muted-foreground p-4 bg-background border-t border-border">
        <p>{t('score_list_page.no_rounds_available')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-background border-t border-border">
      <p className="text-lg font-semibold">{displayCurrentRoundText}</p>
      <div className="flex gap-2 w-full">
        {previousRoundButton}
        {nextRoundButton}
      </div>
    </div>
  );
};

export default RoundNavigationControls;