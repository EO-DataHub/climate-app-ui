import { Select } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

interface Option {
    value: string;
    label: string;
}

export const ObservationsMenu = () => {
    const [options, setOptions] = useState<Option[]>([]);
    const [selected, setSelected] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('./lst_files.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedOptions = Object.keys(data).map((timestamp) => {
                    const year = parseInt(timestamp.substring(0, 4), 10);
                    const month = parseInt(timestamp.substring(4, 6), 10) - 1;
                    const day = parseInt(timestamp.substring(6, 8), 10);

                    const date = new Date(year, month, day);
                    const formattedDate = `${date.getDate()}th ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

                    return { value: timestamp, label: formattedDate };
                });
                setOptions(formattedOptions);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error loading data';
                throw new Error(message);
            }
        };

        fetchData().catch(error => {
            const message = error instanceof Error ? error.message : 'Error in fetchData';
            throw new Error(message);
        });
    }, []);

    return (
        <Select.Root value={selected} onValueChange={setSelected}>
            <Select.Trigger placeholder="Select" />
            <Select.Content id="filter-2">
                {options.map((option) => (
                    <Select.Item key={option.value} value={option.value}>{option.label}</Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
};

